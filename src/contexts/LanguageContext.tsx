import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.funDay': 'Fun Day for Companies',
    'nav.vipTours': 'VIP Tours for Guests',
    'nav.odt': 'ODT Team Building',
    'nav.contact': 'Contact',
    'nav.accessibility': 'Accessibility',
    'nav.accessibilityStatement': 'Accessibility Statement',
    'nav.bookTour': 'Book Tour',
    'nav.adminLogin': 'Admin Login',
    'nav.myAccount': 'My Account',
    'nav.dashboard': 'Dashboard',
    'nav.knowledgeBase': 'Knowledge Base',
    'nav.signOut': 'Sign Out',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.accountMenu': 'Account menu',
    'nav.brandName': 'Simcha',
    'nav.quiz': 'Team Quiz',
    'nav.keywords': 'Keywords',
    'nav.adminChat': 'Admin Chat',
    'nav.leadManagement': 'Lead Management',
    'nav.editAIResponses': 'Edit AI Responses',
    'nav.aiSettings': 'AI Settings (Text)',

    // Hero
    'hero.title': 'A Unique, Empowering & Unforgettable Group Experience',
    'hero.subtitle': 'In beautiful Northern Israel — the valleys, Gilboa Ridge, Harod Springs, the Galilee & around the Sea of Galilee',
    'hero.description': 'A fun, meaningful day combining history, nature, team-building, and great memories for your company.',
    'hero.categories': '🔥 Adventures  |  💧 Nature  |  🏛️ History  |  🍷 Wine & Culinary  |  ⚡ Sports  |  🎨 Creative  |  🌿 Wellness  |  🤝 Teamwork',
    'hero.chatAgent': 'Chat with Smart Agent',
    'hero.bookTour': 'Book a Tour',
    'hero.contactUs': 'Contact Us',
    'hero.whatsapp': 'WhatsApp',
    'hero.generateAI': 'Generate AI Background',
    'hero.scrollDown': 'Scroll down for more content',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent! We\'ll get back to you soon.',
    'contact.error': 'Error sending message. Please try again.',
    'contact.whatsapp': 'WhatsApp',
    'contact.phoneLabel': 'Phone',
    'contact.emailLabel': 'Email',

    // Footer
    'footer.brandName': 'Simcha',
    'footer.description': 'Unforgettable group experiences in Northern Israel — combining history, nature, team-building, and great memories.',
    'footer.contact': 'Contact Us',
    'footer.quickLinks': 'Quick Links',
    'footer.chooseDay': 'Choose Your Fun Day',
    'footer.vipTours': 'VIP Tours',
    'footer.odtActivities': 'ODT Team Building Activities',
    'footer.contactUs': 'Contact Us',
    'footer.accessibilityStatement': 'Accessibility Statement',
    'footer.rights': `© ${new Date().getFullYear()} Simcha. All rights reserved.`,

    // Why Choose Us
    'why.title': 'Why Choose Simcha?',
    'why.certified': 'Professional & Certified',
    'why.certifiedDesc': 'Licensed tour guide with years of experience',
    'why.custom': 'Tailored Experiences',
    'why.customDesc': 'Designed for corporate groups, hi-tech companies, employee committees & professional companies',
    'why.safe': 'Safe & Refreshing',
    'why.safeDesc': 'Perfect for the hot Israeli summer',
    'why.fullService': 'Full Service',
    'why.fullServiceDesc': 'All logistics handled from start to finish',

    // ODT
    'odt.whatIsODT': 'What is ODT?',
    'odt.clickHere': 'Click here',
    'odt.description': 'Outdoor Development Training uses nature-based challenges to strengthen teamwork, leadership, and communication skills.',
    'odt.seeActivities': 'Click to see 15 types of ODT activities with realistic images',
    'odt.benefits': 'ODT Benefits',
    'odt.benefit1': 'Enhanced team collaboration',
    'odt.benefit2': 'Leadership development',
    'odt.benefit3': 'Problem-solving skills',
    'odt.benefit4': 'Trust building',
    'odt.whatsapp': 'WhatsApp',

    // Service Cards
    'services.title': 'Our Services',
    'services.subtitle': 'Choose the perfect experience — daily tours, VIP experiences, or corporate team-building events',
    'services.dailyTitle': 'Daily Tours',
    'services.dailyShort': 'Guided experiences in the Gilboa and Beit She\'an Valley region',
    'services.dailyLong': 'A full day of historical and stunning natural experiences. Perfect for families, friend groups, and work teams.',
    'services.dailyFeature1': 'Choice of 3 customized tour packages',
    'services.dailyFeature2': 'Professional and experienced guide',
    'services.dailyFeature3': 'Personalized for families and groups',
    'services.dailyFeature4': 'Historical sites and stunning viewpoints',
    'services.dailyFeature5': 'Visit crystal-clear springs',
    'services.dailyFeature6': 'Meal included in the area',
    'services.dailyHighlight1': 'Tour duration: 7-8 hours',
    'services.dailyHighlight2': 'Suitable for ages 8-88+',
    'services.dailyHighlight3': 'Guide included, transport not included',
    'services.dailyCTA': 'Choose Your Tour',
    'services.vipTitle': 'VIP Tours',
    'services.vipShort': 'Premium personalized experience with luxury service',
    'services.vipLong': 'An exclusive, fully customized tour. Personal service, luxury vehicles, and top-tier culinary experiences.',
    'services.vipFeature1': '100% personalized itinerary',
    'services.vipFeature2': 'Private luxury vehicles with driver',
    'services.vipFeature3': 'Unique boutique culinary experiences',
    'services.vipFeature4': 'Dedicated private guide throughout the tour',
    'services.vipFeature5': 'Access to exclusive sites',
    'services.vipFeature6': 'Full concierge service',
    'services.vipHighlight1': '1-45 participants',
    'services.vipHighlight2': 'Full coordination to your schedule',
    'services.vipHighlight3': 'Option to include overnight stay',
    'services.vipCTA': 'Plan a VIP Tour',
    'services.odtTitle': 'ODT for Organizations',
    'services.odtShort': 'Outdoor Development Training — team building for companies',
    'services.odtLong': 'Professional ODT program combining challenges, team-building activities, and nature experiences. Suitable for companies of all sizes.',
    'services.odtFeature1': 'Event planning tailored to organizational needs',
    'services.odtFeature2': 'Professional team-building activities with certified facilitators',
    'services.odtFeature3': 'Suitable for groups of 10-200 participants',
    'services.odtFeature4': 'Combination of physical activity and meaningful content',
    'services.odtFeature5': 'Focus on teamwork and leadership',
    'services.odtFeature6': 'Option to include lectures and workshops',
    'services.odtHighlight1': 'Event duration: half day to two days',
    'services.odtHighlight2': 'Professional equipment included',
    'services.odtHighlight3': 'Guide team and support staff',
    'services.odtCTA': 'Contact Us to Plan',
    'services.whatIncluded': 'What\'s Included?',
    'services.keyPoints': 'Key Points',
    'services.clickDetails': 'Click for full details',

    // Testimonials
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Thousands of companies trust us to create unforgettable experiences',
    'testimonials.featured': '⭐ Featured Review',

    // Booking
    'booking.title': 'Book a Tour',
    'booking.subtitle': 'Fill in the details and a representative will contact you',
    'booking.name': 'Full Name *',
    'booking.email': 'Email *',
    'booking.phone': 'Phone *',
    'booking.company': 'Company (optional)',
    'booking.participants': 'Number of Participants *',
    'booking.tourDate': 'Tour Date *',
    'booking.selectDate': 'Select date',
    'booking.duration': 'Tour Duration *',
    'booking.selectDuration': 'Select duration',
    'booking.halfDay': 'Half Day (4 hours)',
    'booking.fullDay': 'Full Day (8 hours)',
    'booking.twoDays': '2 Days',
    'booking.threeDays': '3 Days',
    'booking.custom': 'Custom',
    'booking.language': 'Tour Guide Language *',
    'booking.selectLanguage': 'Select language',
    'booking.specialRequests': 'Special Requests (optional)',
    'booking.specialPlaceholder': 'What would you like to experience, see, or expect on the tour?',
    'booking.submit': 'Submit Booking',
    'booking.submitting': 'Submitting...',
    'booking.success': 'Booking submitted successfully!',
    'booking.successDesc': 'A representative will contact you soon',
    'booking.error': 'Error',
    'booking.errorDesc': 'An error occurred. Please try again.',
    'booking.dateError': 'Please select a tour date',

    // MegaMenu
    'mega.home.desc': 'Discover the Gilboa and Jordan Valley',
    'mega.home.h1': 'Panoramic views',
    'mega.home.h2': 'Unique experiences',
    'mega.home.h3': 'Professionalism & quality',
    'mega.funDay.desc': 'A full day of team-building activities',
    'mega.funDay.h1': '100+ activities',
    'mega.funDay.h2': 'Personalized Quiz',
    'mega.funDay.h3': 'Nature experiences',
    'mega.vip.desc': 'Personalized VIP experiences',
    'mega.vip.h1': 'Luxury service',
    'mega.vip.h2': 'Language guides',
    'mega.vip.h3': 'Personal customization',
    'mega.odt.desc': 'Advanced team-building programs',
    'mega.odt.h1': 'Team building',
    'mega.odt.h2': 'Professional challenges',
    'mega.odt.h3': 'Meaningful experience',
    'mega.contact.desc': 'Happy to help and advise',
    'mega.contact.h1': 'Personal service',
    'mega.contact.h2': 'Quick response',
    'mega.contact.h3': 'Professional consultation',
    'mega.goTo': 'Go to',
  },
  he: {
    // Navigation
    'nav.home': 'בית',
    'nav.funDay': 'יום כייף וגיבוש לחברות',
    'nav.vipTours': 'טיולי VIP לאורחי חברות מחו״ל',
    'nav.odt': 'גיבוש ODT',
    'nav.contact': 'צור קשר',
    'nav.accessibility': 'נגישות',
    'nav.accessibilityStatement': 'הצהרת נגישות',
    'nav.bookTour': 'הזמן סיור',
    'nav.adminLogin': 'כניסת מנהלים',
    'nav.myAccount': 'חשבון שלי',
    'nav.dashboard': 'לוח בקרה',
    'nav.knowledgeBase': 'מאגר ידע',
    'nav.signOut': 'התנתק',
    'nav.openMenu': 'פתח תפריט',
    'nav.closeMenu': 'סגור תפריט',
    'nav.accountMenu': 'תפריט חשבון',
    'nav.brandName': 'שמחה',
    'nav.quiz': 'חידון צוות',
    'nav.keywords': 'מילות מפתח',
    'nav.adminChat': 'צ\'אט מנהל',
    'nav.leadManagement': 'ניהול לידים',
    'nav.editAIResponses': 'עריכת תגובות AI',
    'nav.aiSettings': 'הגדרות AI (טקסטים)',

    // Hero
    'hero.title': 'חוויה קבוצתית מיוחדת, בונה ובלתי נשכחת',
    'hero.subtitle': 'בצפון א״י היפה ובלב העמקים, רכס הגלבוע, עמק המעיינות, הגליל וסובב כנרת',
    'hero.description': 'יום חווייתי, מהנה ומשמעותי שמשלב היסטוריה, טבע, גיבוש, והרבה זיכרונות טובים לחברה שלכם.',
    'hero.categories': '🔥 הרפתקאות  |  💧 טבע  |  🏛️ דברי הימים  |  🍷 יין ואומנות הבישול  |  ⚡ ספורט  |  🎨 יצירה  |  🌿 בריאות  |  🤝 צוותיות',
    'hero.chatAgent': 'שוחח עם הסוכן החכם',
    'hero.bookTour': 'הזמן סיור',
    'hero.contactUs': 'צור קשר',
    'hero.whatsapp': 'וואטסאפ',
    'hero.generateAI': 'צור תמונת רקע ב-AI',
    'hero.scrollDown': 'גלול למטה לתוכן נוסף',

    // Contact
    'contact.title': 'צור קשר',
    'contact.name': 'שם מלא',
    'contact.email': 'דוא"ל',
    'contact.phone': 'טלפון',
    'contact.message': 'הודעה',
    'contact.send': 'שלח הודעה',
    'contact.sending': 'שולח...',
    'contact.success': 'ההודעה נשלחה! נחזור אליך בקרוב.',
    'contact.error': 'שגיאה בשליחת ההודעה. אנא נסה שוב.',
    'contact.whatsapp': 'וואטסאפ',
    'contact.phoneLabel': 'טלפון',
    'contact.emailLabel': 'אימייל',

    // Footer
    'footer.brandName': 'שמחה',
    'footer.description': 'חוויות קבוצתיות בלתי נשכחות בצפון ישראל — משלב היסטוריה, טבע, גיבוש, והרבה זיכרונות טובים.',
    'footer.contact': 'צור קשר',
    'footer.quickLinks': 'קישורים מהירים',
    'footer.chooseDay': 'ביחרו את יום הכייף שלכם',
    'footer.vipTours': 'טיולי VIP',
    'footer.odtActivities': 'פעילויות גיבוש ODT',
    'footer.contactUs': 'צור קשר',
    'footer.accessibilityStatement': 'הצהרת נגישות',
    'footer.rights': `© ${new Date().getFullYear()} שמחה. כל הזכויות שמורות.`,

    // Why Choose Us
    'why.title': 'למה לבחור בשמחה?',
    'why.certified': 'מקצועי ומוסמך',
    'why.certifiedDesc': 'מדריך טיולים מורשה עם שנות ניסיון',
    'why.custom': 'חוויות מותאמות אישית',
    'why.customDesc': 'מעוצב במיוחד לקבוצות עסקיות, חברות הי טק, ועדי עובדים וחברות מקצועיות',
    'why.safe': 'בטוח ומרענן',
    'why.safeDesc': 'מושלם לקיץ הישראלי החם',
    'why.fullService': 'שירות מלא',
    'why.fullServiceDesc': 'כל הלוגיסטיקה מטופלת מתחילה ועד סוף',

    // ODT
    'odt.whatIsODT': 'מהו ODT?',
    'odt.clickHere': 'לחץ כאן',
    'odt.description': 'אימון פיתוח חוץ משתמש באתגרים מבוססי טבע כדי לחזק עבודת צוות, מנהיגות ומיומנויות תקשורת.',
    'odt.seeActivities': 'לחץ כדי לראות 15 סוגי פעילויות ODT עם תמונות ריאליסטיות',
    'odt.benefits': 'ODT יתרונות',
    'odt.benefit1': 'שיתוף פעולה צוותי משופר',
    'odt.benefit2': 'פיתוח מנהיגות',
    'odt.benefit3': 'מיומנויות פתרון בעיות',
    'odt.benefit4': 'בניית אמון',
    'odt.whatsapp': 'וואטסאפ',

    // Service Cards
    'services.title': 'השירותים שלנו',
    'services.subtitle': 'בחר את החוויה המושלמת עבורך - סיורים יומיים, חוויות VIP, או אירועי גיבוש לארגונים',
    'services.dailyTitle': 'סיורים יומיים',
    'services.dailyShort': 'חוויות מודרכות באזור הגלבוע ועמק בית שאן',
    'services.dailyLong': 'יום מלא בחוויות היסטוריות וטבעיות מרהיבות. מתאים למשפחות, קבוצות חברים, וצוותי עבודה.',
    'services.dailyFeature1': 'בחירה מ-3 חבילות סיור מותאמות',
    'services.dailyFeature2': 'מדריך מקצועי ומנוסה',
    'services.dailyFeature3': 'התאמה אישית למשפחות וקבוצות',
    'services.dailyFeature4': 'אתרים היסטוריים ותצפיות נוף מדהימות',
    'services.dailyFeature5': 'ביקור במעיינות צלולים',
    'services.dailyFeature6': 'ארוחה כלולה באזור',
    'services.dailyHighlight1': 'משך הסיור: 7-8 שעות',
    'services.dailyHighlight2': 'מתאים לגילאי 8-88+',
    'services.dailyHighlight3': 'כולל מדריך לא כולל הסעות',
    'services.dailyCTA': 'בחר את הסיור שלך',
    'services.vipTitle': 'סיורי VIP',
    'services.vipShort': 'חוויה פרימיום מותאמת אישית עם שירות יוקרתי',
    'services.vipLong': 'סיור אקסקלוסיבי ומותאם באופן מלא לרצונותיכם. שירות אישי, רכבי יוקרה, וחוויות קולינריות ברמה הגבוהה ביותר.',
    'services.vipFeature1': 'מסלול מותאם אישית 100%',
    'services.vipFeature2': 'רכבי יוקרה פרטיים עם נהג',
    'services.vipFeature3': 'חוויות קולינריות בוטיק ייחודיות',
    'services.vipFeature4': 'מדריך פרטי צמוד לאורך כל הסיור',
    'services.vipFeature5': 'גישה לאתרים ייחודיים',
    'services.vipFeature6': 'שירות קונסיירז\' מלא',
    'services.vipHighlight1': '1-45 משתתפים',
    'services.vipHighlight2': 'תיאום מלא לפי לוח הזמנים שלכם',
    'services.vipHighlight3': 'אפשרות לשילוב לינה',
    'services.vipCTA': 'תכנן סיור VIP',
    'services.odtTitle': 'ODT לארגונים',
    'services.odtShort': 'פיתוח ארגוני בחוץ - גיבוש וצוות לחברות',
    'services.odtLong': 'תוכנית ODT מקצועית המשלבת אתגרים, פעילויות גיבוש, וחוויות בטבע. מתאים לחברות בכל הגדלים.',
    'services.odtFeature1': 'תכנון אירוע מותאם לצרכי הארגון',
    'services.odtFeature2': 'פעילויות גיבוש מקצועיות ומנחים מוסמכים',
    'services.odtFeature3': 'מתאים לקבוצות 10-200 משתתפים',
    'services.odtFeature4': 'שילוב בין פעילות גופנית לתוכן ערכי',
    'services.odtFeature5': 'דגש על עבודת צוות ומנהיגות',
    'services.odtFeature6': 'אפשרות לשילוב הרצאות וסדנאות',
    'services.odtHighlight1': 'משך האירוע: חצי יום עד יומיים',
    'services.odtHighlight2': 'כולל ציוד מקצועי',
    'services.odtHighlight3': 'צוות מדריכים וצוות תמיכה',
    'services.odtCTA': 'צור קשר לתכנון',
    'services.whatIncluded': 'מה כולל?',
    'services.keyPoints': 'נקודות מרכזיות',
    'services.clickDetails': 'לחץ לפרטים מלאים',

    // Testimonials
    'testimonials.title': 'מה הלקוחות שלנו אומרים',
    'testimonials.subtitle': 'אלפי חברות סומכות עלינו ליצירת חוויות בלתי נשכחות',
    'testimonials.featured': '⭐ המלצה מודגשת',

    // Booking
    'booking.title': 'הזמנת סיור',
    'booking.subtitle': 'מלא את הפרטים ונציג יצור איתך קשר',
    'booking.name': 'שם מלא *',
    'booking.email': 'אימייל *',
    'booking.phone': 'טלפון *',
    'booking.company': 'חברה (אופציונלי)',
    'booking.participants': 'מספר משתתפים *',
    'booking.tourDate': 'תאריך הסיור *',
    'booking.selectDate': 'בחר תאריך',
    'booking.duration': 'משך הסיור *',
    'booking.selectDuration': 'בחר משך',
    'booking.halfDay': 'חצי יום (4 שעות)',
    'booking.fullDay': 'יום מלא (8 שעות)',
    'booking.twoDays': 'יומיים',
    'booking.threeDays': '3 ימים',
    'booking.custom': 'מותאם אישית',
    'booking.language': 'שפת המדריך *',
    'booking.selectLanguage': 'בחר שפה',
    'booking.specialRequests': 'בקשות מיוחדות (אופציונלי)',
    'booking.specialPlaceholder': 'מה ברצונכם לחוות, לראות, לצפות בסיור?',
    'booking.submit': 'שלח הזמנה',
    'booking.submitting': 'שולח...',
    'booking.success': 'ההזמנה נשלחה בהצלחה!',
    'booking.successDesc': 'נציג יצור איתך קשר בהקדם',
    'booking.error': 'שגיאה',
    'booking.errorDesc': 'אירעה שגיאה בשליחת ההזמנה. נסה שוב.',
    'booking.dateError': 'נא לבחור תאריך לסיור',

    // MegaMenu
    'mega.home.desc': 'גלה את הגלבוע והעמק הירדן',
    'mega.home.h1': 'נופים פנורמיים',
    'mega.home.h2': 'חוויות ייחודיות',
    'mega.home.h3': 'מקצועיות ואיכות',
    'mega.funDay.desc': 'יום מלא בפעילויות מגבשות',
    'mega.funDay.h1': '100+ פעילויות',
    'mega.funDay.h2': 'Quiz מותאם אישית',
    'mega.funDay.h3': 'חוויות בטבע',
    'mega.vip.desc': 'חוויות VIP מותאמות אישית',
    'mega.vip.h1': 'שירות יוקרתי',
    'mega.vip.h2': 'מדריכי שפות',
    'mega.vip.h3': 'התאמה אישית',
    'mega.odt.desc': 'תוכניות גיבוש צוותיות מתקדמות',
    'mega.odt.h1': 'בניית צוות',
    'mega.odt.h2': 'אתגרים מקצועיים',
    'mega.odt.h3': 'חוויה משמעותית',
    'mega.contact.desc': 'נשמח לעזור ולייעץ',
    'mega.contact.h1': 'שירות אישי',
    'mega.contact.h2': 'מענה מהיר',
    'mega.contact.h3': 'ייעוץ מקצועי',
    'mega.goTo': 'עבור ל',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('site-language');
    return (saved === 'en' || saved === 'he') ? saved : 'he';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('site-language', lang);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'he';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
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
