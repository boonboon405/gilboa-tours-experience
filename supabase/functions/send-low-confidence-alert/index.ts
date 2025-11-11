import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.2.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AlertRequest {
  conversationId: string;
  visitorName: string;
  message: string;
  confidenceScore: number;
  agentEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, visitorName, message, confidenceScore, agentEmail }: AlertRequest = await req.json();

    console.log("Sending low confidence alert:", { conversationId, confidenceScore });

    const recipientEmail = agentEmail || "david@odttours.com"; // Default admin email

    const emailResponse = await resend.emails.send({
      from: "ODT Tours Chat <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `🚨 התראה: ביטחון AI נמוך - ${Math.round(confidenceScore * 100)}%`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              direction: rtl;
              background-color: #f5f5f5;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px 20px;
            }
            .alert-box {
              background-color: #fef2f2;
              border-right: 4px solid #ef4444;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .confidence-score {
              font-size: 36px;
              font-weight: bold;
              color: #ef4444;
              text-align: center;
              margin: 20px 0;
            }
            .message-preview {
              background-color: #f9fafb;
              padding: 15px;
              border-radius: 4px;
              margin: 15px 0;
              font-size: 14px;
              color: #374151;
            }
            .cta-button {
              display: inline-block;
              background-color: #ef4444;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ דרוש סוכן אנושי</h1>
            </div>
            <div class="content">
              <div class="alert-box">
                <strong>תשומת לב!</strong> נזהתה שיחה עם רמת ביטחון נמוכה שדורשת התייחסות אנושית מיידית.
              </div>
              
              <div class="confidence-score">
                ${Math.round(confidenceScore * 100)}%
              </div>
              
              <p><strong>פרטי השיחה:</strong></p>
              <ul>
                <li><strong>מבקר:</strong> ${visitorName || 'אורח'}</li>
                <li><strong>מזהה שיחה:</strong> ${conversationId}</li>
              </ul>
              
              <p><strong>תוכן ההודעה:</strong></p>
              <div class="message-preview">
                ${message}
              </div>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'https://app.lovable.app'}/admin/chat" class="cta-button">
                  עבור לצ'אט עכשיו →
                </a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                מערכת ה-AI זיהתה שהיא אינה בטוחה מספיק בתשובה שסיפקה. אנא בדוק את השיחה והמשך את השיחה עם הלקוח.
              </p>
            </div>
            <div class="footer">
              <p>התראה אוטומטית ממערכת צ'אט ODT Tours</p>
              <p>נשלח ב-${new Date().toLocaleString('he-IL')}</p>
            </div>
          </div>
        </body>
        </html>
      `,
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
    console.error("Error sending low confidence alert:", error);
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
