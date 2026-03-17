import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.book': 'Book Now',

    // Hero
    'hero.tag': 'Group Experiences in Northern Israel',
    'hero.title.1': 'Perfect Day.',
    'hero.title.2': 'Lifetime Memories.',
    'hero.desc': 'Guided tours, team-building days, and VIP experiences in the Gilboa, Springs Valley, and Galilee region.',
    'hero.whatsapp': 'Contact on WhatsApp',
    'hero.book': 'Book a Tour',

    // Services
    'services.title': 'What We Offer',
    'services.subtitle': 'Three ways to experience Northern Israel — each tailored to your needs.',
    'services.daily.title': 'Daily Tours',
    'services.daily.desc': 'Guided tours in Gilboa, Springs Valley, and Beit She\'an — nature, history, and fun combined.',
    'services.vip.title': 'VIP Tours',
    'services.vip.desc': 'Premium experiences for international guests — fully customized tours with top-tier service.',
    'services.odt.title': 'ODT — Team Building',
    'services.odt.desc': 'Challenging outdoor activities for organizations and teams — strengthening bonds through shared experiences.',
    'services.cta': 'Learn More',
    'services.daily.highlights': 'Nature hikes • Historical sites • Springs • Culinary experiences',
    'services.daily.detail': 'A full day exploring the best of Northern Israel. We curate a personalized route combining outdoor adventures, historical landmarks, refreshing springs, and local culinary delights — all with a professional guide.',
    'services.vip.highlights': 'Custom itinerary • Private guide • Luxury transport • Boutique experiences',
    'services.vip.detail': 'Designed for international guests and executive groups. Every detail is tailored — from handpicked locations to premium dining. A white-glove experience showcasing the best of Israeli culture and landscape.',
    'services.odt.highlights': 'Team challenges • Leadership workshops • 10–200 participants • Professional facilitation',
    'services.odt.detail': 'Outdoor Development Training that builds trust, communication, and leadership through shared challenges in nature. Fully facilitated by certified professionals with meals included.',
    'services.detail.cta': 'Contact Us',

    // Testimonials
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Real experiences from happy customers',
    'testimonials.1.name': 'Michal L.',
    'testimonials.1.company': 'HR Manager, Tech Company',
    'testimonials.1.text': 'The team-building day with Simcha was incredible. The team came back with renewed energy and a real sense of belonging.',
    'testimonials.2.name': 'David K.',
    'testimonials.2.company': 'CEO, Import Company',
    'testimonials.2.text': 'We organized a VIP tour for international guests and they couldn\'t stop raving about it. Professional and personal service.',
    'testimonials.3.name': 'Ronit S.',
    'testimonials.3.company': 'Activity Coordinator, Municipality',
    'testimonials.3.text': 'The combination of nature, history, and culinary was perfect. Already planning the next tour.',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Didn\'t find an answer? Contact us.',
    'faq.1.q': 'How many people can participate in a tour?',
    'faq.1.a': 'We accommodate groups of all sizes — from 10 to hundreds of participants. Every tour is fully customized.',
    'faq.2.q': 'Do tours include transportation?',
    'faq.2.a': 'Transportation is not included in the base price, but we\'re happy to help coordinate transport at additional cost.',
    'faq.3.q': 'What does a team-building (ODT) day include?',
    'faq.3.a': 'The team-building day includes challenging outdoor activities, professional facilitation, and meals of your choice.',
    'faq.4.q': 'Which areas do the tours cover?',
    'faq.4.a': 'Tours take place in the Gilboa, Springs Valley, Beit She\'an, Galilee, and Golan regions.',
    'faq.5.q': 'How far in advance should I book?',
    'faq.5.a': 'We recommend booking at least two weeks ahead, but we always try to find a solution even on short notice.',

    // Contact
    'contact.title': 'Talk to Us',
    'contact.desc': 'Want to hear more? Leave your details and we\'ll get back to you, or reach out directly.',
    'contact.phone.label': 'Phone',
    'contact.email.label': 'Email',
    'contact.whatsapp': 'Send a WhatsApp Message',
    'contact.form.name': 'Full Name',
    'contact.form.phone': 'Phone',
    'contact.form.message': 'Tell us what you\'re looking for...',
    'contact.form.submit': 'Send Inquiry',
    'contact.thanks.title': 'Thank you!',
    'contact.thanks.desc': 'We received your inquiry and will get back to you soon.',

    // Footer
    'footer.home': 'Home',
    'footer.services': 'Services',
    'footer.faq': 'FAQ',
    'footer.contact': 'Contact',
    'footer.rights': `© ${new Date().getFullYear()} Simcha. All rights reserved.`,

    // Chat widget
    'chat.title': 'Chat with Simcha',
    'chat.welcome': 'Hi! 👋 How can we help you?',
    'chat.placeholder': 'Type a message...',

    // Voice
    'voice.replay': 'Replay',
    'voice.listening': 'Listening...',
    'voice.realtime.toggle': 'Real-time voice',
    'voice.realtime.warning': 'Real-time voice supports English audio only',
    'voice.realtime.start': 'Start Call',
    'voice.realtime.connecting': 'Connecting...',
    'voice.realtime.end': 'End Call',
    'voice.realtime.error': 'Failed to connect. Please try again.',
    'voice.back.to.chat': 'Back to Chat',
    'voice.you.said': 'You said:',
    'voice.agent.says': 'Agent:',
  },
  he: {
    // Nav
    'nav.home': 'בית',
    'nav.services': 'השירותים',
    'nav.faq': 'שאלות נפוצות',
    'nav.contact': 'צור קשר',
    'nav.book': 'הזמן עכשיו',

    // Hero
    'hero.tag': 'חוויות קבוצתיות בצפון ישראל',
    'hero.title.1': 'יום מושלם.',
    'hero.title.2': 'זיכרונות לכל החיים.',
    'hero.desc': 'סיורים מודרכים, ימי גיבוש, וחוויות VIP באזור הגלבוע, עמק המעיינות והגליל.',
    'hero.whatsapp': 'דברו איתנו בוואטסאפ',
    'hero.book': 'הזמינו סיור',

    // Services
    'services.title': 'מה אנחנו מציעים',
    'services.subtitle': 'שלוש דרכים לחוות את צפון ישראל — כל אחת מותאמת בדיוק לצרכים שלכם.',
    'services.daily.title': 'סיורים יומיים',
    'services.daily.desc': 'סיורים מודרכים בגלבוע, עמק המעיינות ובית שאן — חוויה שמשלבת טבע, היסטוריה וכיף.',
    'services.vip.title': 'סיורי VIP',
    'services.vip.desc': 'חוויות פרמיום לאורחים מחו"ל — סיורים מותאמים אישית עם שירות ברמה הגבוהה ביותר.',
    'services.odt.title': 'ODT — ימי גיבוש',
    'services.odt.desc': 'פעילויות אתגריות בטבע לארגונים וצוותים — חיזוק קשרים דרך חוויה משותפת.',
    'services.cta': 'לפרטים',
    'services.daily.highlights': 'טיולי טבע • אתרים היסטוריים • מעיינות • חוויות קולינריות',
    'services.daily.detail': 'יום שלם של חקירת הטוב ביותר שצפון ישראל מציע. אנחנו בונים מסלול מותאם אישית המשלב הרפתקאות בטבע, אתרים היסטוריים, מעיינות מרעננים וטעימות מקומיות — הכל עם מדריך מקצועי.',
    'services.vip.highlights': 'מסלול מותאם • מדריך פרטי • הסעה פרמיום • חוויות בוטיק',
    'services.vip.detail': 'מעוצב לאורחים מחו"ל ולקבוצות בכירות. כל פרט מותאם — מאתרים נבחרים בקפידה ועד ארוחות פרמיום. חוויה ברמה הגבוהה ביותר המציגה את המיטב של התרבות והנוף הישראלי.',
    'services.odt.highlights': 'אתגרים צוותיים • סדנאות מנהיגות • 10–200 משתתפים • הנחיה מקצועית',
    'services.odt.detail': 'אימון פיתוח ארגוני בחוץ שבונה אמון, תקשורת ומנהיגות דרך אתגרים משותפים בטבע. מונחה במלואו על ידי אנשי מקצוע מוסמכים, כולל ארוחות.',
    'services.detail.cta': 'צרו קשר',

    // Testimonials
    'testimonials.title': 'מה אומרים עלינו',
    'testimonials.subtitle': 'חוויות אמיתיות מלקוחות מרוצים',
    'testimonials.1.name': 'מיכל ל.',
    'testimonials.1.company': 'מנהלת HR, חברת הייטק',
    'testimonials.1.text': 'יום הגיבוש עם שמחה היה מדהים. הצוות חזר עם אנרגיות חדשות ותחושת שייכות אמיתית.',
    'testimonials.2.name': 'דוד כ.',
    'testimonials.2.company': 'מנכ"ל, חברת יבוא',
    'testimonials.2.text': 'ארגנו סיור VIP לאורחים מחו"ל והם לא הפסיקו להתפעל. שירות מקצועי ואישי.',
    'testimonials.3.name': 'רונית ש.',
    'testimonials.3.company': 'רכזת פעילות, עירייה',
    'testimonials.3.text': 'השילוב של טבע, היסטוריה וקולינריה היה מושלם. כבר מתכננים את הסיור הבא.',

    // FAQ
    'faq.title': 'שאלות נפוצות',
    'faq.subtitle': 'לא מצאתם תשובה? צרו איתנו קשר.',
    'faq.1.q': 'כמה אנשים יכולים להשתתף בסיור?',
    'faq.1.a': 'אנחנו מתאימים סיורים לקבוצות בכל גודל — מ-10 ועד מאות משתתפים. כל סיור מותאם אישית.',
    'faq.2.q': 'האם הסיורים כוללים הסעות?',
    'faq.2.a': 'ההסעות אינן כלולות במחיר הבסיסי, אך נשמח לסייע בתיאום הסעות בעלויות נוספות.',
    'faq.3.q': 'מה כולל יום גיבוש (ODT)?',
    'faq.3.a': 'יום הגיבוש כולל פעילויות אתגריות בטבע, הנחיית מנחה מקצועי, וארוחות לפי בחירתכם.',
    'faq.4.q': 'באיזה אזורים מתקיימים הסיורים?',
    'faq.4.a': 'הסיורים מתקיימים באזור הגלבוע, עמק המעיינות, בית שאן, הגליל והגולן.',
    'faq.5.q': 'כמה זמן מראש צריך להזמין?',
    'faq.5.a': 'מומלץ להזמין לפחות שבועיים מראש, אך אנחנו תמיד משתדלים למצוא פתרון גם בהתראה קצרה.',

    // Contact
    'contact.title': 'דברו איתנו',
    'contact.desc': 'רוצים לשמוע עוד? השאירו פרטים ונחזור אליכם, או פנו אלינו ישירות.',
    'contact.phone.label': 'טלפון',
    'contact.email.label': 'אימייל',
    'contact.whatsapp': 'שלחו הודעה בוואטסאפ',
    'contact.form.name': 'שם מלא',
    'contact.form.phone': 'טלפון',
    'contact.form.message': 'ספרו לנו מה אתם מחפשים...',
    'contact.form.submit': 'שלחו פנייה',
    'contact.thanks.title': 'תודה!',
    'contact.thanks.desc': 'קיבלנו את הפנייה שלכם ונחזור בהקדם.',

    // Footer
    'footer.home': 'בית',
    'footer.services': 'שירותים',
    'footer.faq': 'שאלות נפוצות',
    'footer.contact': 'צור קשר',
    'footer.rights': `© ${new Date().getFullYear()} Simcha. כל הזכויות שמורות.`,

    // Chat widget
    'chat.title': 'צ׳אט עם שמחה',
    'chat.welcome': 'שלום! 👋 איך אפשר לעזור לכם?',
    'chat.placeholder': 'כתבו הודעה...',
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
    return translations[language][key] || key;
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
