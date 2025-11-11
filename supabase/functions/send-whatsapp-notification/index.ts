import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppNotificationRequest {
  phone: string;
  message: string;
  template_name?: string;
  template_params?: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message, template_name, template_params }: WhatsAppNotificationRequest = await req.json();
    
    console.log(`Sending WhatsApp notification to ${phone}`);

    // Get WhatsApp API credentials from environment
    const whatsappApiKey = Deno.env.get("WHATSAPP_API_KEY");
    const whatsappPhoneId = Deno.env.get("WHATSAPP_PHONE_ID");

    if (!whatsappApiKey || !whatsappPhoneId) {
      throw new Error("WhatsApp API credentials not configured");
    }

    // Format phone number (remove non-digits, ensure it has country code)
    const formattedPhone = phone.replace(/\D/g, "");

    // Prepare WhatsApp API request
    const whatsappUrl = `https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`;
    
    let payload: any;

    if (template_name) {
      // Use template message
      payload = {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: template_name,
          language: { code: "he" },
          components: template_params ? [
            {
              type: "body",
              parameters: Object.entries(template_params).map(([key, value]) => ({
                type: "text",
                text: value,
              })),
            }
          ] : [],
        },
      };
    } else {
      // Use text message
      payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "text",
        text: {
          preview_url: false,
          body: message,
        },
      };
    }

    const response = await fetch(whatsappUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${whatsappApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", responseData);
      throw new Error(responseData.error?.message || "Failed to send WhatsApp message");
    }

    console.log("WhatsApp message sent successfully:", responseData);

    return new Response(
      JSON.stringify({
        success: true,
        message_id: responseData.messages?.[0]?.id,
        data: responseData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-whatsapp-notification:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Make sure to configure WHATSAPP_API_KEY and WHATSAPP_PHONE_ID in Supabase secrets"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
