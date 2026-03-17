import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.testimonials': 'Testimonials',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'hero.title': 'Perfect Day. Lifetime Memories.',
    'hero.subtitle': 'Group Experiences in Northern Israel',
    'hero.description': 'Guided tours, team-building days, and VIP experiences in the Gilboa, Springs Valley, and Galilee region.',
    'hero.cta': 'Talk to Us',
    'hero.book': 'Book a Tour',
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Tell us about your event...',
    'contact.send': 'Send Message',
    'contact.title': 'Get in Touch',
    'why.title': 'Why Choose Simcha?',
    'why.certified': 'Professional & Certified',
    'why.certified.desc': 'Licensed tour guide with years of experience',
    'why.custom': 'Tailored Experiences',
    'why.custom.desc': 'Designed for corporate and professional groups',
    'why.safe': 'Safe & Refreshing',
    'why.safe.desc': 'Perfect for hot Israeli summers',
    'why.logistics': 'Full Service',
    'why.logistics.desc': 'All logistics handled from start to finish',
    'footer.rights': '© 2025 Simcha. All rights reserved.',
  },
  he: {
    'nav.home': 'בית',
    'nav.services': 'השירותים',
    'nav.testimonials': 'לקוחות',
    'nav.faq': 'שאלות נפוצות',
    'nav.contact': 'צור קשר',
    'hero.title': 'יום מושלם. זיכרונות לכל החיים.',
    'hero.subtitle': 'חוויות קבוצתיות בצפון ישראל',
    'hero.description': 'סיורים מודרכים, ימי גיבוש, וחוויות VIP באזור הגלבוע, עמק המעיינות והגליל.',
    'hero.cta': 'דברו איתנו',
    'hero.book': 'הזמינו סיור',
    'contact.name': 'שם מלא',
    'contact.email': 'דוא"ל',
    'contact.phone': 'טלפון',
    'contact.message': 'ספרו לנו על האירוע שלכם...',
    'contact.send': 'שלח הודעה',
    'contact.title': 'צור קשר',
    'why.title': 'למה לבחור ב-Simcha?',
    'why.certified': 'מקצועי ומוסמך',
    'why.certified.desc': 'מדריך טיולים מורשה עם שנות ניסיון',
    'why.custom': 'חוויות מותאמות אישית',
    'why.custom.desc': 'מעוצב במיוחד לקבוצות עסקיות וחברות',
    'why.safe': 'בטוח ומרענן',
    'why.safe.desc': 'מושלם לקיץ הישראלי החם',
    'why.logistics': 'שירות מלא',
    'why.logistics.desc': 'כל הלוגיסטיקה מטופלת מתחילה ועד סוף',
    'footer.rights': '© 2025 Simcha. כל הזכויות שמורות.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('simcha-language');
    return (saved === 'en' ? 'en' : 'he') as Language;
  });

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('simcha-language', language);
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
