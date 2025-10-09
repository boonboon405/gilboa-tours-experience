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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { selections }: PreferencesEmailRequest = await req.json();

    console.log("Sending preferences email with selections:", selections);

    // Build HTML content for the email
    let emailContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>העדפות לקוח חדשות - David Tours</h2>
        <p>התקבלה בחירת פעילויות חדשה מהאתר:</p>
        <br>
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
      subject: "העדפות לקוח חדשות - בחירת פעילויות",
      html: emailContent,
    });

    console.log("Preferences email sent successfully:", emailResponse);

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
