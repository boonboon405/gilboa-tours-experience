/**
 * Configuration for Text-to-Speech (TTS) processing
 * Manage word replacements and settings here without changing code
 */

export interface TTSConfig {
  enableLogging: boolean;
  defaultRate: number; // Speech rate (0.1 to 10, default 1)
  wordReplacements: Record<string, string>;
}

/**
 * TTS Configuration
 * - enableLogging: Set to false in production to disable console logs
 * - defaultRate: Default speech rate (0.7 = 30% slower for better clarity)
 * - wordReplacements: Map of words to replace for better TTS pronunciation
 */
export const ttsConfig: TTSConfig = {
  // Toggle logging on/off
  enableLogging: true,
  
  // Default speech rate (0.7 is 30% slower than normal for clarity)
  defaultRate: 0.7,
  
  // Word replacements for better TTS pronunciation
  // Pure Hebrew replacements - avoiding Arabic-origin slang
  wordReplacements: {
    'DNA': 'רצונות',
    'דנא': 'רצונות',
    'תכלס': 'בעצם',
    'באסה': 'רע',
    'מגניב': 'נחמד',
    'סבבה': 'בסדר',
    'וואלה': 'באמת',
    'דאבל': 'כפול',
    'פרטנר': 'שותף',
    'סטטוס': 'מצב',
    'טופ': 'מעולה',
    'קול': 'מגניב',
    'וייב': 'אווירה',
    'צ\'יל': 'רגוע',
    'סטרס': 'לחץ',
    'פאן': 'כיף',
    'קאמבק': 'חזרה',
    'סטורי': 'סיפור',
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
