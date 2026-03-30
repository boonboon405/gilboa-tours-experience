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

interface PreferencesEmailRequest {
  selections?: {
    [key: number]: {
      sectionTitle: string;
      activities: string[];
      otherOption?: string;
    };
  };
  vipDestinations?: {
    [key: number]: {
      region: string;
      sites: string[];
    };
  };
  contactInfo: {
    name: string;
    email: string;
    company: string;
    whatsappNumber: string;
    officeNumber: string;
    participantCount: string;
    tourType: string;
    specialComments: string;
    language: string;
  };
  suggestedDate?: string;
  tourType?: string;
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
    const { selections, vipDestinations, contactInfo, suggestedDate, tourType }: PreferencesEmailRequest = await req.json();

    console.log("Sending preferences email with selections:", selections);
    console.log("VIP destinations:", vipDestinations);
    console.log("Contact info:", contactInfo);
    console.log("Suggested date:", suggestedDate);
    console.log("Tour type:", tourType);

    const safeName = esc(contactInfo.name);
    const safeEmail = esc(contactInfo.email);
    const safeCompany = esc(contactInfo.company);
    const safeWhatsapp = esc(contactInfo.whatsappNumber);
    const safeOffice = esc(contactInfo.officeNumber);
    const safeParticipants = esc(contactInfo.participantCount);
    const safeTourType = esc(contactInfo.tourType);
    const safeComments = esc(contactInfo.specialComments);
    const safeLanguage = esc(contactInfo.language);
    const safeSuggestedDate = suggestedDate ? esc(suggestedDate) : '';
    const safeTopTourType = tourType ? esc(tourType) : '';

    let emailContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>העדפות לקוח חדשות - David Tours</h2>
        <p>התקבלה בחירת ${safeTopTourType === 'VIP Tour' ? 'טיול VIP' : 'פעילויות'} חדשה מהאתר:</p>
        <br>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-top: 0;">פרטי יצירת קשר</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 40%;">שם:</td>
              <td style="padding: 8px;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">אימייל:</td>
              <td style="padding: 8px;">${safeEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">חברה:</td>
              <td style="padding: 8px;">${safeCompany}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">מספר וואטסאפ:</td>
              <td style="padding: 8px;">${safeWhatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">מספר משרד:</td>
              <td style="padding: 8px;">${safeOffice}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">מספר משתתפים משוער:</td>
              <td style="padding: 8px;">${safeParticipants}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">סוג טיול:</td>
              <td style="padding: 8px;">${safeTourType}</td>
            </tr>
            ${safeSuggestedDate ? `
            <tr>
              <td style="padding: 8px; font-weight: bold;">תאריך מוצע לאירוע:</td>
              <td style="padding: 8px;">${safeSuggestedDate}</td>
            </tr>
            ` : ''}
            ${safeComments ? `
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">הערות ומשאלות מיוחדות:</td>
              <td style="padding: 8px; white-space: pre-wrap;">${safeComments}</td>
            </tr>
            ` : ''}
            ${safeLanguage ? `
            <tr>
              <td style="padding: 8px; font-weight: bold;">שפה נדרשת לאורחים:</td>
              <td style="padding: 8px;">${safeLanguage}</td>
            </tr>
            ` : ''}
          </table>
        </div>
    `;

    if (tourType === 'VIP Tour' && vipDestinations) {
      emailContent += `
        <h3 style="color: #9333ea; margin-top: 30px;">אתרים שנבחרו לטיול VIP:</h3>
      `;
      
      Object.entries(vipDestinations).forEach(([regionId, destination]) => {
        if (destination.sites.length > 0) {
          emailContent += `
            <div style="background-color: #faf5ff; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h4 style="color: #7c3aed; margin-top: 0;">${esc(destination.region)}</h4>
              <ul style="margin: 10px 0;">
          `;
          destination.sites.forEach(site => {
            emailContent += `<li style="margin-bottom: 5px;">${esc(site)}</li>`;
          });
          emailContent += `
              </ul>
            </div>
          `;
        }
      });
    } else if (selections) {
      emailContent += `
        <h3 style="color: #2563eb;">בחירות פעילויות:</h3>
      `;
      
      Object.entries(selections).forEach(([sectionId, section]) => {
        if (section.activities.length > 0 || section.otherOption) {
          emailContent += `
            <h3 style="color: #2563eb; margin-top: 20px;">קטגוריה ${esc(sectionId)}: ${esc(section.sectionTitle)}</h3>
          `;
          
          if (section.activities.length > 0) {
            emailContent += `<ul style="margin-top: 10px;">`;
            section.activities.forEach(activity => {
              emailContent += `<li style="margin-bottom: 8px;">${esc(activity)}</li>`;
            });
            emailContent += `</ul>`;
          }
          
          if (section.otherOption) {
            emailContent += `
              <p style="margin-top: 10px; padding: 10px; background-color: #f3f4f6; border-radius: 5px;">
                <strong>אפשרות אחרת:</strong> ${esc(section.otherOption)}
              </p>
            `;
          }
        }
      });
    }

    emailContent += `
        <br>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          נשלח מאתר David Tours ב-${new Date().toLocaleString('he-IL')}
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "David Tours <onboarding@resend.dev>",
      to: ["DavidIsraelTours@gmail.com"],
      subject: `העדפות לקוח חדשות - ${safeName} - ${safeCompany}`,
      html: emailContent,
    });

    console.log("Preferences email sent successfully:", emailResponse);

    const archiveResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/rest/v1/email_archive`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": Deno.env.get("SUPABASE_ANON_KEY") || "",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          recipient_email: "DavidIsraelTours@gmail.com",
          subject: `העדפות לקוח חדשות - ${safeName} - ${safeCompany}`,
          html_content: emailContent,
          status: emailResponse.error ? "failed" : "sent",
          error_message: emailResponse.error?.message || null,
          email_data: {
            contactInfo,
            selections,
            vipDestinations,
            suggestedDate,
            tourType,
            resend_response: emailResponse
          }
        })
      }
    );

    if (!archiveResponse.ok) {
      console.error("Error archiving email:", await archiveResponse.text());
    } else {
      console.log("Email archived successfully to database");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailResponse 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-preferences-email function:", error);
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
