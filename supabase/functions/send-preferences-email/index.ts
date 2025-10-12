import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.5.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PreferencesEmailRequest {
  selections: {
    [key: number]: {
      sectionTitle: string;
      activities: string[];
      otherOption?: string;
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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { selections, contactInfo, suggestedDate }: PreferencesEmailRequest = await req.json();

    console.log("Sending preferences email with selections:", selections);
    console.log("Contact info:", contactInfo);
    console.log("Suggested date:", suggestedDate);

    // Build HTML content for the email
    let emailContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>העדפות לקוח חדשות - David Tours</h2>
        <p>התקבלה בחירת פעילויות חדשה מהאתר:</p>
        <br>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-top: 0;">פרטי יצירת קשר</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 40%;">שם:</td>
              <td style="padding: 8px;">${contactInfo.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">אימייל:</td>
              <td style="padding: 8px;">${contactInfo.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">חברה:</td>
              <td style="padding: 8px;">${contactInfo.company}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">מספר וואטסאפ:</td>
              <td style="padding: 8px;">${contactInfo.whatsappNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">מספר משרד:</td>
              <td style="padding: 8px;">${contactInfo.officeNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">מספר משתתפים משוער:</td>
              <td style="padding: 8px;">${contactInfo.participantCount}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">סוג טיול:</td>
              <td style="padding: 8px;">${contactInfo.tourType}</td>
            </tr>
            ${suggestedDate ? `
            <tr>
              <td style="padding: 8px; font-weight: bold;">תאריך מוצע לאירוע:</td>
              <td style="padding: 8px;">${suggestedDate}</td>
            </tr>
            ` : ''}
            ${contactInfo.specialComments ? `
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">הערות ומשאלות מיוחדות:</td>
              <td style="padding: 8px; white-space: pre-wrap;">${contactInfo.specialComments}</td>
            </tr>
            ` : ''}
            ${contactInfo.language ? `
            <tr>
              <td style="padding: 8px; font-weight: bold;">שפה נדרשת לאורחים:</td>
              <td style="padding: 8px;">${contactInfo.language}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <h3 style="color: #2563eb;">בחירות פעילויות:</h3>
    `;

    // Add each section's selections
    Object.entries(selections).forEach(([sectionId, section]) => {
      if (section.activities.length > 0 || section.otherOption) {
        emailContent += `
          <h3 style="color: #2563eb; margin-top: 20px;">קטגוריה ${sectionId}: ${section.sectionTitle}</h3>
        `;
        
        if (section.activities.length > 0) {
          emailContent += `<ul style="margin-top: 10px;">`;
          section.activities.forEach(activity => {
            emailContent += `<li style="margin-bottom: 8px;">${activity}</li>`;
          });
          emailContent += `</ul>`;
        }
        
        if (section.otherOption) {
          emailContent += `
            <p style="margin-top: 10px; padding: 10px; background-color: #f3f4f6; border-radius: 5px;">
              <strong>אפשרות אחרת:</strong> ${section.otherOption}
            </p>
          `;
        }
      }
    });

    emailContent += `
        <br>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          נשלח מאתר David Tours ב-${new Date().toLocaleString('he-IL')}
        </p>
      </div>
    `;

    // Send email to business
    const emailResponse = await resend.emails.send({
      from: "David Tours <onboarding@resend.dev>",
      to: ["DavidIsraelTours@gmail.com"],
      subject: `העדפות לקוח חדשות - ${contactInfo.name} - ${contactInfo.company}`,
      html: emailContent,
    });

    console.log("Preferences email sent successfully:", emailResponse);

    // Archive the email to database
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
          subject: `העדפות לקוח חדשות - ${contactInfo.name} - ${contactInfo.company}`,
          html_content: emailContent,
          status: emailResponse.error ? "failed" : "sent",
          error_message: emailResponse.error?.message || null,
          email_data: {
            contactInfo,
            selections,
            suggestedDate,
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
