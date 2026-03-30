import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.5.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return true; }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

interface BookingNotificationRequest {
  booking: {
    id: string;
    tour_type: string;
    tour_date: string;
    participants_count: number;
    tour_duration: string;
    preferred_language: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_company?: string;
    special_requests?: string;
    selected_destinations?: string[];
    status: string;
    created_at: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('cf-connecting-ip') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return new Response('Too many requests', { status: 429, headers: corsHeaders });
  }

  try {
    const { booking }: BookingNotificationRequest = await req.json();
    
    console.log("Sending booking notification for:", booking.id);

    const bookingDetails = `
      <h2>הזמנה חדשה התקבלה!</h2>
      
      <h3>פרטי ההזמנה:</h3>
      <ul>
        <li><strong>מזהה הזמנה:</strong> ${esc(booking.id)}</li>
        <li><strong>סוג סיור:</strong> ${esc(booking.tour_type)}</li>
        <li><strong>תאריך:</strong> ${esc(booking.tour_date)}</li>
        <li><strong>מספר משתתפים:</strong> ${booking.participants_count}</li>
        <li><strong>משך הסיור:</strong> ${esc(booking.tour_duration)}</li>
        <li><strong>שפה מועדפת:</strong> ${esc(booking.preferred_language)}</li>
        <li><strong>סטטוס:</strong> ${esc(booking.status)}</li>
      </ul>

      <h3>פרטי הלקוח:</h3>
      <ul>
        <li><strong>שם:</strong> ${esc(booking.customer_name)}</li>
        <li><strong>אימייל:</strong> ${esc(booking.customer_email)}</li>
        <li><strong>טלפון:</strong> ${esc(booking.customer_phone)}</li>
        ${booking.customer_company ? `<li><strong>חברה:</strong> ${esc(booking.customer_company)}</li>` : ''}
      </ul>

      ${booking.selected_destinations && booking.selected_destinations.length > 0 ? `
        <h3>יעדים שנבחרו:</h3>
        <ul>
          ${booking.selected_destinations.map(dest => `<li>${esc(dest)}</li>`).join('')}
        </ul>
      ` : ''}

      ${booking.special_requests ? `
        <h3>בקשות מיוחדות:</h3>
        <p>${esc(booking.special_requests)}</p>
      ` : ''}

      <hr>
      <p><small>התקבל ב: ${new Date(booking.created_at).toLocaleString('he-IL')}</small></p>
    `;

    const emailResponse = await resend.emails.send({
      from: "David Tours <onboarding@resend.dev>",
      to: ["DavidIsraelTours@gmail.com"],
      subject: `🎉 הזמנה חדשה מ-${esc(booking.customer_name)}`,
      html: bookingDetails,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
