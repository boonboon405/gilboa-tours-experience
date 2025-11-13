/**
 * Sanitizes text for Text-to-Speech (TTS) by removing special characters,
 * emojis, markdown formatting, and other elements that interfere with natural speech.
 */

import { ttsConfig } from './ttsConfig';

/**
 * Removes emojis from text
 */
const removeEmojis = (text: string): string => {
  return text.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
    .replace(/[\u{2600}-\u{26FF}]/gu, '') // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
    .replace(/[\u{FE00}-\u{FE0F}]/gu, ''); // Variation Selectors
};

/**
 * Removes markdown formatting
 */
const removeMarkdown = (text: string): string => {
  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
    .replace(/~~(.*?)~~/g, '$1') // Strikethrough
    .replace(/`{1,3}[^`\n]+`{1,3}/g, '') // Code blocks
    .replace(/#{1,6}\s?/g, '') // Headers
    .replace(/>\s?/g, '') // Blockquotes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Images
    .replace(/[-*+]\s/g, '') // Unordered lists
    .replace(/\d+\.\s/g, ''); // Ordered lists
};

/**
 * Removes or replaces special characters that interfere with TTS
 */
const cleanSpecialCharacters = (text: string): string => {
  return text
    .replace(/[!]{2,}/g, '.') // Multiple exclamation marks to period
    .replace(/[?]{2,}/g, '?') // Multiple question marks to single
    .replace(/[.]{2,}/g, '.') // Multiple periods to single
    .replace(/[-]{2,}/g, ' ') // Multiple dashes to space
    .replace(/\|/g, '...') // Convert pipe to multiple periods for longer pause
    .replace(/[*#@$%^&+=<>{}[\]\\~`]/g, '') // Remove special chars
    .replace(/[:;]/g, ','); // Convert colons/semicolons to commas for natural pauses
};

/**
 * Replaces colloquial words with more appropriate alternatives for TTS
 * Uses the configuration from ttsConfig for easy maintenance
 */
const replaceColloquialWords = (text: string): string => {
  let result = text;
  
  // Apply all word replacements from config
  Object.entries(ttsConfig.wordReplacements).forEach(([original, replacement]) => {
    const regex = new RegExp(original, 'g');
    result = result.replace(regex, replacement);
  });
  
  return result;
};

/**
 * Normalizes whitespace
 */
const normalizeWhitespace = (text: string): string => {
  return text
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/\n+/g, ' ') // Newlines to spaces
    .trim(); // Trim edges
};

/**
 * Conditional logging based on config
 */
const log = (...args: any[]) => {
  if (ttsConfig.enableLogging) {
    console.log(...args);
  }
};

/**
 * Main function to sanitize text for TTS
 * @param text - The raw text to sanitize
 * @returns Clean text suitable for TTS
 */
export const sanitizeForTTS = (text: string): string => {
  if (!text || typeof text !== 'string') {
    log('[TTS Sanitizer] Empty or invalid text input');
    return '';
  }

  log('[TTS Sanitizer] Original text:', text);
  let sanitized = text;
  
  // Apply all sanitization steps in order
  sanitized = removeEmojis(sanitized);
  log('[TTS Sanitizer] After emoji removal:', sanitized);
  
  sanitized = removeMarkdown(sanitized);
  log('[TTS Sanitizer] After markdown removal:', sanitized);
  
  sanitized = cleanSpecialCharacters(sanitized);
  log('[TTS Sanitizer] After special chars cleanup:', sanitized);
  
  sanitized = replaceColloquialWords(sanitized);
  log('[TTS Sanitizer] After colloquial word replacement:', sanitized);
  
  sanitized = normalizeWhitespace(sanitized);
  log('[TTS Sanitizer] Final sanitized text:', sanitized);

  return sanitized;
};

/**
 * Sanitizes text and ensures it's not empty after cleaning
 * @param text - The raw text to sanitize
 * @param fallback - Optional fallback text if result is empty
 * @returns Clean text or fallback
 */
export const sanitizeForTTSWithFallback = (
  text: string, 
  fallback: string = 'תגובה התקבלה'
): string => {
  const sanitized = sanitizeForTTS(text);
  return sanitized.length > 0 ? sanitized : fallback;
};
