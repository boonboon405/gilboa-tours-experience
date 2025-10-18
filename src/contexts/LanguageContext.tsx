import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.activities': 'Activities',
    'nav.odt': 'ODT Team Building',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Discover the Ultimate Team Experience',
    'hero.subtitle': 'in the Heart of the Gilboa',
    'hero.description': 'Powerful, fun-filled day trips combining history, nature, team-building, and unforgettable memories for your company.',
    'hero.cta': 'Book Your Adventure',
    'hero.whatsapp': 'WhatsApp Us',
    
    // Contact Form
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.title': 'Get in Touch',
    
    // Activities
    'activities.title': 'What Does the Day Include?',
    'activities.subtitle': 'Three key elements: history, nature, and teamwork',
    'activities.history.title': 'Historical & Natural Wonders',
    'activities.history.desc': 'Visit Katef Shaul, witness Irus Gilboa flowers, and watch majestic pelicans migrate over the Jordan Valley.',
    'activities.adventure.title': 'Adventure & Team Building',
    'activities.adventure.desc': 'Electric club car navigation through Nahal HaMaayanot, four natural springs, and interactive water games.',
    'activities.culture.title': 'Ancient Rome in Beit She\'an',
    'activities.culture.desc': 'Explore impressive Roman ruins, hippodrome, and amphitheater dating back 2,000 years.',
    'activities.culinary.title': 'Culinary Experience',
    'activities.culinary.desc': 'Rich, flavorful meal at a kosher oriental restaurant—authentic taste of the region.',
    
    // ODT
    'odt.title': 'ODT Team Building Activities',
    'odt.subtitle': 'Outdoor Development Training for Your Team',
    'odt.what': 'What is ODT?',
    'odt.what.desc': 'Outdoor Development Training uses nature-based challenges to strengthen teamwork, leadership, and communication skills.',
    'odt.benefits': 'Benefits',
    'odt.benefit1': 'Enhanced team collaboration',
    'odt.benefit2': 'Leadership development',
    'odt.benefit3': 'Problem-solving skills',
    'odt.benefit4': 'Trust building',
    'odt.activities': 'Our ODT Activities',
    
    // Why Choose Us
    'why.title': 'Why Choose DavidTours?',
    'why.certified': 'Professional & Certified',
    'why.certified.desc': 'Licensed tour guide with years of experience',
    'why.custom': 'Tailored Experiences',
    'why.custom.desc': 'Designed for corporate and professional groups',
    'why.safe': 'Safe & Refreshing',
    'why.safe.desc': 'Perfect for hot Israeli summers',
    'why.logistics': 'Full Service',
    'why.logistics.desc': 'All logistics handled from start to finish',
    
    // Footer
    'footer.contact': 'Contact Us',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'footer.rights': '© 2025 DavidTours. All rights reserved.',
    'footer.brand.desc': 'A powerful, fun-filled day combining history, nature, team-building, and great memories for your company.',
    'footer.links': 'Quick Links',
    'footer.chooseDay': 'Choose Your Day',
    'footer.vipTours': 'VIP Tours',
    'footer.odt': 'ODT Activities',
    
    // VIP Tours
    'vip.title': 'VIP Tours for Foreign Guests',
    'vip.badge': 'VIP Tours - Up to 19 travelers',
    'vip.description.p1': 'Is your company hosting foreign guests? David Tours can host them in a luxurious VIP air-conditioned vehicle tour and provide them with an unforgettable travel experience throughout Israel.',
    'vip.description.p2': 'Suitable for groups of 1-19 travelers • Professional driver and expert guide • Luxurious air-conditioned vehicle • Custom-tailored routes',
    'vip.features.vehicle': 'VIP Air-Conditioned Vehicle',
    'vip.features.guide': 'Professional Guide',
    'vip.features.route': 'Custom-Tailored Route',
    'vip.select.title': 'Choose Your Preferred Sites',
    'vip.select.description': 'List of 50 recommended sites to visit in Israel, divided by geographic regions – from north to south',
    'vip.select.note': 'The list includes historical, natural, religious, and cultural sites considered among the most important and fascinating in the country',
    'vip.summary.title': 'Your VIP Tour Selection Summary',
    'vip.summary.selected': 'sites selected',
    'vip.send': 'Send to Email',
    'vip.sending': 'Sending...',
    
    // Choose Your Day
    'choose.title': 'Choose Your Fun Day - 100 Topics to Choose From',
    'choose.subtitle': 'Choose from 4 categories your four (4) preferred attractions or sites',
    'choose.morning': 'Morning Adventure',
    'choose.cooling': 'Springs Relaxation',
    'choose.heritage': 'Heritage Encounter',
    'choose.culinary': 'Culinary Celebration',
    'choose.combine': 'Combine them chronologically to create a full day plan (09:00 - 17:00)',
    'choose.summary.title': 'Your Selection Summary',
    'choose.summary.activities': 'activities selected',
    'choose.summary.contact': 'Contact Information',
    
    // Contact Form Fields
    'form.name': 'Full Name',
    'form.email': 'Email',
    'form.company': 'Company Name',
    'form.whatsapp': 'WhatsApp Number',
    'form.office': 'Office Number',
    'form.participants': 'Number of Participants',
    'form.budget': 'Budget per Person (NIS)',
    'form.tourType': 'Tour Type',
    'form.oneDay': 'One Day',
    'form.multiDay': 'Multi-Day',
    'form.date': 'Suggested Date',
    'form.language': 'Preferred Guide Language',
    'form.hebrew': 'Hebrew',
    'form.english': 'English',
    'form.russian': 'Russian',
    'form.french': 'French',
    'form.spanish': 'Spanish',
    'form.comments': 'Special Comments or Requests',
    'form.required': '* Required',
    'form.missingFields': 'Missing Details',
    'form.fillRequired': 'Please fill all required fields (name, email, company, and WhatsApp number)',
    'form.invalidEmail': 'Invalid Email',
    'form.enterValidEmail': 'Please enter a valid email address',
    'form.success': 'Sent Successfully!',
    'form.successDesc': 'Your preferences have been sent to our email. We\'ll get back to you soon.',
    'form.error': 'Sending Error',
    'form.errorDesc': 'An error occurred while sending preferences. Please try again later.',
  },
  he: {
    // Navigation
    'nav.home': 'בית',
    'nav.activities': 'פעילויות',
    'nav.odt': 'גיבוש ODT',
    'nav.about': 'אודות',
    'nav.contact': 'צור קשר',
    
    // Hero
    'hero.title': 'חוויה קבוצתית בלתי נשכחת',
    'hero.subtitle': 'בלב הגלבוע',
    'hero.description': 'יום חווייתי, מהנה ומשמעותי שמשלב היסטוריה, טבע, גיבוש והרבה זיכרונות טובים לחברה שלכם.',
    'hero.cta': 'הזמינו את ההרפתקה',
    'hero.whatsapp': 'וואטסאפ',
    
    // Contact Form
    'contact.name': 'שם מלא',
    'contact.email': 'דוא"ל',
    'contact.phone': 'טלפון',
    'contact.message': 'הודעה',
    'contact.send': 'שלח הודעה',
    'contact.title': 'צור קשר',
    
    // Activities
    'activities.title': 'מה כולל היום?',
    'activities.subtitle': 'שלושה מרכיבים עיקריים: היסטוריה, טבע וגיבוש צוותי',
    'activities.history.title': 'טבע ונוף היסטורי',
    'activities.history.desc': 'ביקור בכתף שאול, צפייה באירוס הגלבוע, נצפה בשקנאים מרהיבים בנדידה מעל לבריכות הדגים של העמק.',
    'activities.adventure.title': 'הרפתקאות ODT וגיבוש',
    'activities.adventure.desc': 'ניווט ברכבי קלאב קאר חשמליים בנחל המעיינות, ארבעה מעיינות טבעיים, ומשחקי מים אינטראקטיביים.',
    'activities.culture.title': 'רומא העתיקה בבית שאן',
    'activities.culture.desc': 'ביקור בעתיקות המרשימות של בית שאן הרומית - היפודרום והאמפיתיאטרון.',
    'activities.culinary.title': 'חוויה קולינרית',
    'activities.culinary.desc': 'ארוחה עשירה במסעדה כשרה עם אוכל מזרחי טעים ואותנטי - אירוח וטעם אמיתי של האזור.',
    
    // ODT
    'odt.title': 'פעילויות גיבוש ODT',
    'odt.subtitle': 'אימון פיתוח חוץ לצוות שלכם',
    'odt.what': 'מהו ODT?',
    'odt.what.desc': 'אימון פיתוח חוץ משתמש באתגרים מבוססי טבע כדי לחזק עבודת צוות, מנהיגות ומיומנויות תקשורת.',
    'odt.benefits': 'יתרונות',
    'odt.benefit1': 'שיתוף פעולה צוותי משופר',
    'odt.benefit2': 'פיתוח מנהיגות',
    'odt.benefit3': 'מיומנויות פתרון בעיות',
    'odt.benefit4': 'בניית אמון',
    'odt.activities': 'הפעילויות שלנו',
    
    // Why Choose Us
    'why.title': 'למה לבחור בדוד טורס?',
    'why.certified': 'מקצועי ומוסמך',
    'why.certified.desc': 'מדריך טיולים מורשה עם שנות ניסיון',
    'why.custom': 'חוויות מותאמות אישית',
    'why.custom.desc': 'מעוצב במיוחד לקבוצות עסקיות, חברות הי טק, ועדי עובדים וחברות מקצועיות',
    'why.safe': 'בטוח ומרענן',
    'why.safe.desc': 'מושלם לקיץ הישראלי החם',
    'why.logistics': 'שירות מלא',
    'why.logistics.desc': 'כל הלוגיסטיקה מטופלת מתחילה ועד סוף',
    
    // Footer
    'footer.contact': 'צור קשר',
    'footer.phone': 'טלפון',
    'footer.email': 'אימייל',
    'footer.rights': '© 2025 דוד טורס. כל הזכויות שמורות.',
    'footer.brand.desc': 'יום חווייתי, מהנה ומשמעותי שמשלב היסטוריה, טבע, גיבוש והרבה זיכרונות טובים לחברה שלכם.',
    'footer.links': 'קישורים מהירים',
    'footer.chooseDay': 'ביחרו את יום הכייף שלכם',
    'footer.vipTours': 'טיולי VIP',
    'footer.odt': 'פעילויות גיבוש ODT',
    
    // VIP Tours
    'vip.title': 'טיולי VIP לאורחים מחו״ל',
    'vip.badge': 'טיולי VIP - עד 19 מטיילים',
    'vip.description.p1': 'החברה שלכם מארחת אורחים מחו״ל? דייויד טורס יכול לארח אותם בטיול VIP ברכב ממוזג מפואר ולהעניק להם חוויית טיול בלתי נשכחת ברחבי ישראל.',
    'vip.description.p2': 'מתאים לקבוצות של 1-19 מטיילים • נהג מקצועי ומדריך מומחה • רכב מפואר וממוזג • מסלולים מותאמים אישית',
    'vip.features.vehicle': 'רכב VIP ממוזג',
    'vip.features.guide': 'מדריך מקצועי',
    'vip.features.route': 'מסלול מותאם אישית',
    'vip.select.title': 'בחרו את האתרים המועדפים עליכם',
    'vip.select.description': 'רשימת 50 אתרים מומלצים לביקור בישראל, מחולקים לפי אזורים גיאוגרפיים – מצפון לדרום',
    'vip.select.note': 'הרשימה כוללת אתרים היסטוריים, טבעיים, דתיים ותרבותיים, שנחשבים מהחשובים והמרתקים ביותר בארץ',
    'vip.summary.title': 'סיכום הבחירות שלך לטיול VIP',
    'vip.summary.selected': 'אתרים נבחרו',
    'vip.send': 'שלח למייל',
    'vip.sending': 'שולח...',
    
    // Choose Your Day
    'choose.title': 'בחרו את יום הכיף שלכם להלן 100 נושאים לבחירה',
    'choose.subtitle': 'בחרו מתוך 4 הקטגוריות את ארבעת (4) האטרקציות או האתרים המועדפים עליכם',
    'choose.morning': 'הרפתקת בוקר',
    'choose.cooling': 'הרגעת מעיינות',
    'choose.heritage': 'מפגש מורשת',
    'choose.culinary': 'חגיגה קולינרית',
    'choose.combine': 'שלב אותן באופן כרונולוגי ליצירת תוכנית יום מלא (09:00 - 17:00)',
    'choose.summary.title': 'סיכום הבחירות שלך',
    'choose.summary.activities': 'פעילויות נבחרו',
    'choose.summary.contact': 'פרטי יצירת קשר',
    
    // Contact Form Fields
    'form.name': 'שם מלא',
    'form.email': 'אימייל',
    'form.company': 'שם החברה',
    'form.whatsapp': 'מספר וואטסאפ',
    'form.office': 'מספר משרדי',
    'form.participants': 'מספר משתתפים',
    'form.budget': 'תקציב לאדם (ש״ח)',
    'form.tourType': 'סוג הטיול',
    'form.oneDay': 'יום אחד',
    'form.multiDay': 'מספר ימים',
    'form.date': 'תאריך מוצע',
    'form.language': 'שפת מדריך מועדפת',
    'form.hebrew': 'עברית',
    'form.english': 'אנגלית',
    'form.russian': 'רוסית',
    'form.french': 'צרפתית',
    'form.spanish': 'ספרדית',
    'form.comments': 'הערות או בקשות מיוחדות',
    'form.required': '* שדה חובה',
    'form.missingFields': 'פרטים חסרים',
    'form.fillRequired': 'אנא מלא את כל השדות הנדרשים (שם, אימייל, חברה, ומספר וואטסאפ)',
    'form.invalidEmail': 'אימייל לא תקין',
    'form.enterValidEmail': 'אנא הכנס כתובת אימייל תקינה',
    'form.success': 'נשלח בהצלחה!',
    'form.successDesc': 'ההעדפות שלך נשלחו למייל שלנו. נחזור אליך בהקדם.',
    'form.error': 'שגיאה בשליחה',
    'form.errorDesc': 'אירעה שגיאה בשליחת ההעדפות. נסה שוב מאוחר יותר.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('he');

  useEffect(() => {
    // Apply RTL for Hebrew
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
