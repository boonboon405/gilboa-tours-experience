/**
 * Configuration for Text-to-Speech (TTS) processing
 * Manage word replacements and settings here without changing code
 */

export interface TTSConfig {
  enableLogging: boolean;
  defaultRate: number; // Speech rate (0.1 to 10, default 1)
  enableQualityCheck: boolean; // Enable automatic quality checking
  minQualityScore: number; // Minimum quality score to pass (0-100)
  wordReplacements: Record<string, string>;
}

/**
 * TTS Configuration
 * - enableLogging: Set to false in production to disable console logs
 * - defaultRate: Default speech rate (0.7 = 30% slower for better clarity)
 * - enableQualityCheck: Automatically check and fix text quality before TTS
 * - minQualityScore: Minimum quality score required (0-100)
 * - wordReplacements: Map of words to replace for better TTS pronunciation
 */
export const ttsConfig: TTSConfig = {
  // Toggle logging on/off
  enableLogging: true,
  
  // Default speech rate (0.7 is 30% slower than normal for clarity)
  defaultRate: 0.7,
  
  // Quality control
  enableQualityCheck: true,
  minQualityScore: 70,
  
  // Word replacements for better TTS pronunciation
  // Pure Hebrew replacements - avoiding Arabic-origin slang
  wordReplacements: {
    // Core replacements
    'DNA': 'רצונות',
    'דנא': 'רצונות',
    
    // Arabic-origin to proper Hebrew
    'תכלס': 'למעשה',
    'באסה': 'קשה',
    'מגניב': 'נהדר',
    'סבבה': 'בסדר',
    'וואלה': 'באמת',
    'יאללה': 'בואו',
    'יאלה': 'קדימה',
    'אחלה': 'מצוין',
    'חלאס': 'נגמר',
    'מסכין': 'מסכן',
    'חביבי': 'ידידי',
    
    // English to Hebrew
    'דאבל': 'כפול',
    'פרטנר': 'שותף',
    'סטטוס': 'מצב',
    'טופ': 'מעולה',
    'קול': 'נהדר',
    'וייב': 'אווירה',
    'צ\'יל': 'רגוע',
    'סטרס': 'לחץ',
    'פאן': 'הנאה',
    'קאמבק': 'חזרה',
    'סטורי': 'סיפור',
    'לייק': 'אהבתי',
    'ביי': 'להתראות',
    'היי': 'שלום',
    'סורי': 'סליחה',
    'וואו': 'נפלא',
    
    // Slang to formal
    'אחי': 'חבר',
    'רצח': 'מעולה',
    'בום': 'מצוין',
    'חזק': 'נהדר'
  }
};

/**
 * Update TTS logging setting at runtime
 */
export const setTTSLogging = (enabled: boolean) => {
  ttsConfig.enableLogging = enabled;
};

/**
 * Update TTS speech rate at runtime
 */
export const setTTSRate = (rate: number) => {
  // Ensure rate is between 0.1 and 10
  ttsConfig.defaultRate = Math.max(0.1, Math.min(10, rate));
};

/**
 * Update TTS quality check setting at runtime
 */
export const setTTSQualityCheck = (enabled: boolean) => {
  ttsConfig.enableQualityCheck = enabled;
};

/**
 * Update minimum quality score at runtime
 */
export const setMinQualityScore = (score: number) => {
  ttsConfig.minQualityScore = Math.max(0, Math.min(100, score));
};

/**
 * Add or update a word replacement
 */
export const addWordReplacement = (original: string, replacement: string) => {
  ttsConfig.wordReplacements[original] = replacement;
};

/**
 * Remove a word replacement
 */
export const removeWordReplacement = (original: string) => {
  delete ttsConfig.wordReplacements[original];
};
