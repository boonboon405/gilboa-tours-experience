import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWhatsAppNotifier = () => {
  const { toast } = useToast();

  const sendWhatsAppNotification = async (
    phone: string,
    message: string,
    templateName?: string,
    templateParams?: Record<string, string>
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
        body: {
          phone,
          message,
          template_name: templateName,
          template_params: templateParams,
        },
      });

      if (error) throw error;

      toast({
        title: "הודעת WhatsApp נשלחה",
        description: "ההודעה נשלחה בהצלחה",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Error sending WhatsApp notification:', error);
      
      toast({
        title: "שגיאה בשליחת הודעה",
        description: error.message || "לא ניתן לשלוח הודעת WhatsApp",
        variant: "destructive",
      });

      return { success: false, error };
    }
  };

  return { sendWhatsAppNotification };
};
