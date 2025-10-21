import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.5.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking }: BookingNotificationRequest = await req.json();
    
    console.log("Sending booking notification for:", booking.id);

    // Format the booking details for the email
    const bookingDetails = `
      <h2>הזמנה חדשה התקבלה!</h2>
      
      <h3>פרטי ההזמנה:</h3>
      <ul>
        <li><strong>מזהה הזמנה:</strong> ${booking.id}</li>
        <li><strong>סוג סיור:</strong> ${booking.tour_type}</li>
        <li><strong>תאריך:</strong> ${booking.tour_date}</li>
        <li><strong>מספר משתתפים:</strong> ${booking.participants_count}</li>
        <li><strong>משך הסיור:</strong> ${booking.tour_duration}</li>
        <li><strong>שפה מועדפת:</strong> ${booking.preferred_language}</li>
        <li><strong>סטטוס:</strong> ${booking.status}</li>
      </ul>

      <h3>פרטי הלקוח:</h3>
      <ul>
        <li><strong>שם:</strong> ${booking.customer_name}</li>
        <li><strong>אימייל:</strong> ${booking.customer_email}</li>
        <li><strong>טלפון:</strong> ${booking.customer_phone}</li>
        ${booking.customer_company ? `<li><strong>חברה:</strong> ${booking.customer_company}</li>` : ''}
      </ul>

      ${booking.selected_destinations && booking.selected_destinations.length > 0 ? `
        <h3>יעדים שנבחרו:</h3>
        <ul>
          ${booking.selected_destinations.map(dest => `<li>${dest}</li>`).join('')}
        </ul>
      ` : ''}

      ${booking.special_requests ? `
        <h3>בקשות מיוחדות:</h3>
        <p>${booking.special_requests}</p>
      ` : ''}

      <hr>
      <p><small>התקבל ב: ${new Date(booking.created_at).toLocaleString('he-IL')}</small></p>
    `;

    const emailResponse = await resend.emails.send({
      from: "David Tours <onboarding@resend.dev>",
      to: ["DavidIsraelTours@gmail.com"],
      subject: `🎉 הזמנה חדשה מ-${booking.customer_name}`,
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
