import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  source_platform?: string;
  interested_keywords?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadNotificationRequest = await req.json();
    console.log("Processing lead notification for:", leadData.name);

    const { name, email, phone, notes, source_platform, interested_keywords } = leadData;

    // Send notification to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎯 ליד חדש נוצר!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">פרטי הליד</h2>
          
          <table style="width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; background: #f5f5f5; font-weight: bold; width: 150px;">שם:</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            ${email ? `
            <tr>
              <td style="padding: 10px; background: #f5f5f5; font-weight: bold;">אימייל:</td>
              <td style="padding: 10px;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></td>
            </tr>
            ` : ''}
            ${phone ? `
            <tr>
              <td style="padding: 10px; background: #f5f5f5; font-weight: bold;">טלפון:</td>
              <td style="padding: 10px;"><a href="tel:${phone}" style="color: #667eea;">${phone}</a></td>
            </tr>
            ` : ''}
            ${source_platform ? `
            <tr>
              <td style="padding: 10px; background: #f5f5f5; font-weight: bold;">מקור:</td>
              <td style="padding: 10px;">${source_platform}</td>
            </tr>
            ` : ''}
            ${interested_keywords && interested_keywords.length > 0 ? `
            <tr>
              <td style="padding: 10px; background: #f5f5f5; font-weight: bold;">תחומי עניין:</td>
              <td style="padding: 10px;">${interested_keywords.join(', ')}</td>
            </tr>
            ` : ''}
          </table>

          ${notes ? `
          <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-right: 4px solid #ffc107; border-radius: 4px;">
            <h3 style="margin: 0 0 10px 0; color: #856404;">הערות:</h3>
            <p style="margin: 0; color: #856404;">${notes}</p>
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">יש ליצור קשר עם הליד בהקדם האפשרי</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
          <p>© ${new Date().getFullYear()} דויד טורס - כל הזכויות שמורות</p>
        </div>
      </div>
    `;

    const adminEmail = await resend.emails.send({
      from: "David Tours <onboarding@resend.dev>",
      to: ["DavidIsraelTours@gmail.com"],
      subject: `🎯 ליד חדש: ${name}`,
      html: adminEmailHtml,
    });

    console.log("Admin notification sent:", adminEmail);

    // Send confirmation to lead if email provided
    let leadEmail = null;
    if (email) {
      const leadEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">דויד טורס</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">חוויית טיול בלתי נשכחת</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
...
          </div>

          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            <p>© ${new Date().getFullYear()} דויד טורס - כל הזכויות שמורות</p>
          </div>
        </div>
      `;

      leadEmail = await resend.emails.send({
        from: "David Tours <onboarding@resend.dev>",
        to: [email],
        subject: "תודה על פנייתך - דויד טורס",
        html: leadEmailHtml,
      });

      console.log("Lead confirmation sent:", leadEmail);
    }

    return new Response(
      JSON.stringify({
        success: true,
        adminEmail,
        leadEmail,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lead-notification:", error);
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
