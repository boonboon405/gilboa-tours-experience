import { supabase } from "@/integrations/supabase/client";

interface TrackContactParams {
  contactType: 'whatsapp' | 'phone' | 'email';
  contactValue: string;
  messageTemplate?: string;
  sourcePage: string;
}

export const trackContact = async ({
  contactType,
  contactValue,
  messageTemplate,
  sourcePage
}: TrackContactParams) => {
  try {
    await supabase.from('contact_tracking').insert({
      contact_type: contactType,
      contact_value: contactValue,
      message_template: messageTemplate,
      source_page: sourcePage,
      user_session: sessionStorage.getItem('session_id') || 'anonymous',
      user_agent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    });
  } catch (error) {
    console.error('Error tracking contact:', error);
  }
};

export const whatsappTemplates = {
  general: "שלום, אני מעוניין/ת לקבל פרטים נוספים על טיולים בצפון ישראל",
  booking: "שלום, אני מעוניין/ת להזמין יום גיבוש. אשמח לפרטים נוספים",
  inquiry: "שלום דוד, יש לי שאלה לגבי הטיולים שלכם",
  quote: "שלום, אשמח לקבל הצעת מחיר ליום גיבוש",
  springs: "שלום, אני מעוניין/ת בטיול למעיינות סחנה",
  clubCars: "שלום, אני מעוניין/ת ברכבי שטח באזור הגלבוע",
  beitShean: "שלום, אני מעוניין/ת בסיור בבית שאן העתיקה",
  culinary: "שלום, אני מעוניין/ת בחוויה קולינרית בכפר נחלל"
};

export const openWhatsApp = (phone: string, message: string, source: string) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  trackContact({
    contactType: 'whatsapp',
    contactValue: phone,
    messageTemplate: message,
    sourcePage: source
  });
  
  window.open(whatsappUrl, '_blank');
};

export const trackPhoneCall = (phone: string, source: string) => {
  trackContact({
    contactType: 'phone',
    contactValue: phone,
    sourcePage: source
  });
};