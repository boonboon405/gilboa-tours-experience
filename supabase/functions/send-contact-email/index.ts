import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.5.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact email for:", { name, email, phone });

    // Validate input
    if (!name || !email || !phone || !message) {
      throw new Error("All fields are required");
    }

    // Send notification email to business
    const notificationEmail = await resend.emails.send({
      from: "David Tours <onboarding@resend.dev>",
      to: ["info@davidtours.com"],
      subject: `הודעה חדשה מ-${name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>הודעה חדשה מאתר David Tours</h2>
          <p><strong>שם:</strong> ${name}</p>
          <p><strong>אימייל:</strong> ${email}</p>
          <p><strong>טלפון:</strong> ${phone}</p>
          <p><strong>הודעה:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation email to customer
    const confirmationEmail = await resend.emails.send({
      from: "David Tours <onboarding@resend.dev>",
      to: [email],
      subject: "קיבלנו את הודעתך!",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h1>שלום ${name},</h1>
          <p>תודה שפנית אלינו!</p>
          <p>קיבלנו את הודעתך ונחזור אליך בהקדם האפשרי.</p>
          <br>
          <p>בברכה,</p>
          <p><strong>צוות David Tours</strong></p>
          <p>טלפון: 053-7314235</p>
          <p>אימייל: info@davidtours.com</p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationEmail, 
        confirmationEmail 
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
    console.error("Error in send-contact-email function:", error);
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
