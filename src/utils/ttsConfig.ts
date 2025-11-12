/**
 * Configuration for Text-to-Speech (TTS) processing
 * Manage word replacements and settings here without changing code
 */

export interface TTSConfig {
  enableLogging: boolean;
  wordReplacements: Record<string, string>;
}

/**
 * TTS Configuration
 * - enableLogging: Set to false in production to disable console logs
 * - wordReplacements: Map of words to replace for better TTS pronunciation
 */
export const ttsConfig: TTSConfig = {
  // Toggle logging on/off
  enableLogging: true,
  
  // Word replacements for better TTS pronunciation
  wordReplacements: {
    'יאללה': 'קדימה',
    'DNA': 'רצונות',
    'דנא': 'רצונות',
  }
};

/**
 * Update TTS logging setting at runtime
 */
export const setTTSLogging = (enabled: boolean) => {
  ttsConfig.enableLogging = enabled;
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
