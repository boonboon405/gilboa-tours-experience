import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing email queue...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get pending emails scheduled for now or earlier
    const { data: pendingEmails, error: fetchError } = await supabase
      .from("email_queue")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString())
      .limit(10);

    if (fetchError) {
      console.error("Error fetching emails:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${pendingEmails?.length || 0} emails to process`);

    let processed = 0;
    let failed = 0;

    for (const email of pendingEmails || []) {
      try {
        console.log(`Sending email to ${email.recipient_email}...`);

        const { data, error: sendError } = await resend.emails.send({
          from: "David Tours <onboarding@resend.dev>",
          to: [email.recipient_email],
          subject: email.subject,
          html: email.html_content,
        });

        if (sendError) {
          throw sendError;
        }

        // Update email status to sent
        await supabase
          .from("email_queue")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", email.id);

        processed++;
        console.log(`Email sent successfully to ${email.recipient_email}`);
      } catch (error: any) {
        console.error(`Failed to send email to ${email.recipient_email}:`, error);

        // Update email status to failed
        await supabase
          .from("email_queue")
          .update({
            status: "failed",
            error_message: error.message || "Unknown error",
          })
          .eq("id", email.id);

        failed++;
      }
    }

    const result = {
      success: true,
      processed,
      failed,
      total: pendingEmails?.length || 0,
      timestamp: new Date().toISOString(),
    };

    console.log("Email queue processing complete:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in process-email-queue:", error);
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
