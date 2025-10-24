import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'he';

const translations = {
  en: {
    Navigation: {
      home: "Home",
      vipTours: "VIP Tours for Corporate Guests from Abroad",
      contact: "Contact",
      book: "Book Now"
    },
    Hero: {
      title: "Discover the Magic of the Gilboa",
      subtitle: "Professional guided tours in the Gilboa region - nature, heritage and unforgettable experiences",
      cta: "Book Your Tour"
    },
    "Contact Form": {
      title: "Contact Us",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent Successfully",
      successDescription: "We'll get back to you as soon as possible",
      errorTitle: "Error",
      errorDescription: "There was an error sending your message. Please try again."
    },
    "Booking Form": {
      title: "Book Your Tour",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      company: "Company Name",
      participants: "Number of Participants",
      tourDate: "Tour Date",
      selectDate: "Select Date",
      duration: "Tour Duration",
      halfDay: "Half Day",
      fullDay: "Full Day",
      multiDay: "Multi-Day",
      language: "Preferred Language",
      hebrew: "Hebrew",
      english: "English",
      russian: "Russian",
      arabic: "Arabic",
      specialRequests: "Special Requests",
      book: "Book Tour",
      booking: "Booking...",
      successTitle: "Booking Submitted Successfully",
      successDescription: "We'll contact you soon to confirm the details",
      errorTitle: "Error",
      errorDescription: "There was an error submitting your booking. Please try again."
    }
  },
  he: {
    Navigation: {
      home: "בית",
      vipTours: "טיולי VIP לאורחי חברות מחו״ל",
      contact: "צור קשר",
      book: "הזמן עכשיו"
    },
    Hero: {
      title: "גלו את קסם הגלבוע",
      subtitle: "סיורים מודרכים מקצועיים באזור הגלבוע - טבע, מורשת וחוויות בלתי נשכחות",
      cta: "הזמן את הסיור שלך"
    },
    "Contact Form": {
      title: "צור קשר",
      name: "שם מלא",
      email: "אימייל",
      phone: "טלפון",
      message: "הודעה",
      send: "שלח הודעה",
      sending: "שולח...",
      successTitle: "ההודעה נשלחה בהצלחה",
      successDescription: "ניצור איתך קשר בהקדם",
      errorTitle: "שגיאה",
      errorDescription: "אירעה שגיאה בשליחת ההודעה. אנא נסה שוב."
    },
    "Booking Form": {
      title: "הזמן את הסיור שלך",
      name: "שם מלא",
      email: "אימייל",
      phone: "טלפון",
      company: "שם החברה",
      participants: "מספר משתתפים",
      tourDate: "תאריך הסיור",
      selectDate: "בחר תאריך",
      duration: "משך הסיור",
      halfDay: "חצי יום",
      fullDay: "יום מלא",
      multiDay: "מספר ימים",
      language: "שפה מועדפת",
      hebrew: "עברית",
      english: "אנגלית",
      russian: "רוסית",
      arabic: "עربית",
      specialRequests: "בקשות מיוחדות",
      book: "הזמן סיור",
      booking: "מזמין...",
      successTitle: "ההזמנה נשלחה בהצלחה",
      successDescription: "ניצור קשר בקרוב לאישור הפרטים",
      errorTitle: "שגיאה",
      errorDescription: "אירעה שגיאה בשליחת ההזמנה. אנא נסה שוב."
    }
  }
};

interface LanguageState {
  language: Language;
}

const initialState: LanguageState = {
  language: 'he'
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      document.documentElement.dir = action.payload === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = action.payload;
    }
  }
});

export const { setLanguage } = languageSlice.actions;

// Selector to get translation
export const getTranslation = (state: { language: LanguageState }, section: keyof typeof translations.en, key: string): string => {
  const lang = state.language.language;
  const sectionTranslations = translations[lang][section] as Record<string, string>;
  return sectionTranslations?.[key] || key;
};

export const getLanguage = (state: { language: LanguageState }) => state.language.language;

export default languageSlice.reducer;
