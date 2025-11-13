/**
 * TTS Quality Checker - Ensures high-quality Hebrew without slang or Arabic-origin words
 */

// Comprehensive list of forbidden Arabic-origin and slang words
const FORBIDDEN_WORDS = [
  // Arabic-origin words (common in street Hebrew)
  'יאללה', 'יאלה', 'אללה', 'אחלה', 'סחתיין', 'סבבה', 'סאבבה', 
  'חלאס', 'חאלס', 'וואלה', 'ואלה', 'מסכין', 'מסכינה', 'חביבי',
  'חארה', 'כיף', 'כיפאק', 'מנטש', 'טמבל', 'פאדיחה', 'חאפלה',
  'סאבבה', 'כיפאק', 'פזמון', 'עלק', 'שרמוטה', 'כוסית',
  'זבל', 'זיין', 'קורבאן', 'קורבן', 'אימא', 'אוחטי',
  
  // English slang commonly used in Hebrew
  'קול', 'וואו', 'וואוו', 'אנטר', 'סורי', 'ביי', 'היי',
  'לייק', 'שייר', 'פוסט', 'סטורי', 'סטטוס', 'אפדייט',
  'טופ', 'בוס', 'אולטרה', 'סופר', 'מגה', 'מקס',
  
  // Common slang
  'תכלס', 'באסה', 'מגניב', 'וייב', 'צ\'יל', 'אחי', 
  'בעניין', 'בכלל', 'ממש', 'רצח', 'מלכה', 'מלך',
  'דפוק', 'פאקד', 'קשה', 'חזק', 'טוב', 'בום',
  
  // Additional problematic terms
  'דאבל', 'פרטנר', 'סטרס', 'פאן', 'קאמבק', 'אאוט',
  'קומבינה', 'סבבות', 'כיפאק', 'חנון', 'פראייר',
  'גבר', 'מניאק', 'קיצוני', 'פצצה', 'חולה', 'חולאאא'
];

// Proper Hebrew alternatives
const HEBREW_REPLACEMENTS: Record<string, string> = {
  // Arabic-origin to proper Hebrew
  'יאללה': 'בואו',
  'יאלה': 'קדימה',
  'אחלה': 'מצוין',
  'סבבה': 'בסדר',
  'וואלה': 'באמת',
  'חלאס': 'נגמר',
  'מסכין': 'מסכן',
  'חביבי': 'ידידי',
  'כיף': 'הנאה',
  
  // English to Hebrew
  'קול': 'מעולה',
  'וואו': 'נפלא',
  'סורי': 'סליחה',
  'ביי': 'להתראות',
  'היי': 'שלום',
  'לייק': 'אהבתי',
  'טופ': 'מעולה',
  
  // Slang to formal
  'תכלס': 'למעשה',
  'באסה': 'קשה',
  'מגניב': 'נהדר',
  'וייב': 'אווירה',
  'צ\'יל': 'רגוע',
  'אחי': 'חבר',
  'רצח': 'מעולה',
  'בום': 'מצוין',
  'חזק': 'נהדר',
  
  // Technical terms
  'דאבל': 'כפול',
  'פרטנר': 'שותף',
  'סטרס': 'לחץ',
  'פאן': 'הנאה',
  'קאמבק': 'חזרה',
  'סטטוס': 'מצב',
  'סטורי': 'סיפור'
};

export interface QualityCheckResult {
  passed: boolean;
  score: number; // 0-100
  issues: string[];
  fixedText?: string;
  details: {
    forbiddenWordsFound: string[];
    replacementsMade: number;
    originalLength: number;
    finalLength: number;
  };
}

/**
 * Check text quality for TTS - detects slang and Arabic-origin words
 */
export const checkTTSQuality = (text: string): QualityCheckResult => {
  const issues: string[] = [];
  const foundForbidden: string[] = [];
  let fixedText = text;
  let replacementCount = 0;
  
  // Normalize text for checking
  const lowerText = text.toLowerCase();
  
  // Check for forbidden words
  FORBIDDEN_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(lowerText)) {
      foundForbidden.push(word);
      
      // Try to replace with proper Hebrew
      if (HEBREW_REPLACEMENTS[word]) {
        fixedText = fixedText.replace(regex, HEBREW_REPLACEMENTS[word]);
        replacementCount++;
      } else {
        issues.push(`נמצאה מילה בסלנג/ערבית: "${word}" ללא תחליף`);
      }
    }
  });
  
  // Calculate quality score
  let score = 100;
  
  // Deduct points for forbidden words (-10 per word)
  score -= foundForbidden.length * 10;
  
  // Deduct points for unreplaced forbidden words (-20 per word)
  const unreplacedWords = foundForbidden.filter(word => !HEBREW_REPLACEMENTS[word]);
  score -= unreplacedWords.length * 20;
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Determine if quality check passed (score must be 70+)
  const passed = score >= 70 && unreplacedWords.length === 0;
  
  if (foundForbidden.length > 0) {
    issues.push(`נמצאו ${foundForbidden.length} מילות סלנג/ערבית`);
  }
  
  return {
    passed,
    score,
    issues,
    fixedText: replacementCount > 0 ? fixedText : undefined,
    details: {
      forbiddenWordsFound: foundForbidden,
      replacementsMade: replacementCount,
      originalLength: text.length,
      finalLength: fixedText.length
    }
  };
};

/**
 * Clean text for high-quality Hebrew TTS
 * Returns cleaned text with all slang and Arabic-origin words replaced
 */
export const cleanForHighQualityTTS = (text: string): string => {
  let cleaned = text;
  
  // Replace all known problematic words
  Object.entries(HEBREW_REPLACEMENTS).forEach(([slang, proper]) => {
    const regex = new RegExp(`\\b${slang}\\b`, 'gi');
    cleaned = cleaned.replace(regex, proper);
  });
  
  return cleaned;
};

/**
 * Get quality metrics for logging/monitoring
 */
export const getTTSQualityMetrics = (text: string) => {
  const result = checkTTSQuality(text);
  return {
    qualityScore: result.score,
    passed: result.passed,
    issuesCount: result.issues.length,
    forbiddenWordsCount: result.details.forbiddenWordsFound.length,
    replacementsMade: result.details.replacementsMade
  };
};
