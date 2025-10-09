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
    'activities.adventure.title': 'הרפתקה וגיבוש',
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
