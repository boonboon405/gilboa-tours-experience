import { activityDNAMap, DNACategory } from './activityCategories';

// Keywords that indicate a category in Hebrew
const categoryKeywords: Record<DNACategory, string[]> = {
  adventure: ['הרפתקא', 'אתגר', 'אדרנלין', 'ג\'יפ', 'רפלינ', 'זיפליין', 'קטגר', 'פיינטבול', 'קיאק'],
  nature: ['טבע', 'נחל', 'מעיין', 'נוף', 'מים', 'שחיי', 'גן השלושה', 'סחנה', 'כנרת', 'עצים', 'דשא'],
  history: ['היסטור', 'רומי', 'בית שאן', 'פסיפס', 'מוזיאון', 'מקרא', 'שאול', 'גלבוע', 'מורשת', 'תרבות'],
  culinary: ['אוכל', 'קולינר', 'יין', 'טעימ', 'ארוחה', 'מסעדה', 'בישול', 'גבינ', 'שמן זית', 'בירה', 'חומוס'],
  sports: ['ספורט', 'תחרות', 'ריצ', 'מרוץ', 'חתיר', 'רכיב', 'חץ וקשת', 'משחק', 'כדור', 'צוות'],
  creative: ['יצירה', 'אמנות', 'צילום', 'מוזיקה', 'ציור', 'סדנ'],
  wellness: ['רוגע', 'יוגה', 'עיסוי', 'פינוק', 'בריאות', 'מדיטצי', 'מתיחה', 'רלקס']
};

// Detect categories in a message based on keywords
export function detectCategoriesInMessage(message: string): DNACategory[] {
  const detectedCategories = new Set<DNACategory>();
  const lowerMessage = message.toLowerCase();
  
  // Check for keyword matches
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      detectedCategories.add(category as DNACategory);
    }
  });
  
  // Check for activity mentions from the activity DNA map
  Object.entries(activityDNAMap).forEach(([activityText, dna]) => {
    // Extract key words from activity text (minimum 4 characters)
    const activityWords = activityText
      .toLowerCase()
      .split(/[\s\-\/\(\)]+/)
      .filter(word => word.length >= 4);
    
    // If any significant word from the activity is mentioned
    const isActivityMentioned = activityWords.some(word => 
      lowerMessage.includes(word)
    );
    
    if (isActivityMentioned) {
      // Add the top categories from this activity's DNA
      Object.entries(dna).forEach(([cat, score]) => {
        if (score && score >= 3) {
          detectedCategories.add(cat as DNACategory);
        }
      });
    }
  });
  
  return Array.from(detectedCategories);
}
