/**
 * Client Session Management
 * Detects new clients and resets quiz/chat data for fresh sessions
 */

const CLIENT_SESSION_KEY = 'client-session-id';
const QUIZ_RESULTS_KEY = 'teamDNAResults';
const QUIZ_RESULTS_ALT_KEY = 'quizResults';
const CHAT_HISTORY_KEY = 'chatHistory';
const PREFERRED_VOICE_KEY = 'preferred-voice';

/**
 * Generate a unique session ID based on timestamp and random values
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Check if this is a new client session and reset data if needed
 * Uses sessionStorage to detect new browser sessions/tabs
 */
export function checkAndResetForNewClient(): boolean {
  const existingSessionId = sessionStorage.getItem(CLIENT_SESSION_KEY);
  
  if (!existingSessionId) {
    // This is a new browser session - reset quiz and chat data
    console.log('[ClientSession] New client detected, resetting quiz and chat data');
    
    // Clear quiz results
    localStorage.removeItem(QUIZ_RESULTS_KEY);
    localStorage.removeItem(QUIZ_RESULTS_ALT_KEY);
    
    // Clear chat history
    localStorage.removeItem(CHAT_HISTORY_KEY);
    
    // Generate new session ID
    const newSessionId = generateSessionId();
    sessionStorage.setItem(CLIENT_SESSION_KEY, newSessionId);
    
    console.log('[ClientSession] New session created:', newSessionId);
    return true; // Is new client
  }
  
  console.log('[ClientSession] Existing session found:', existingSessionId);
  return false; // Is returning client in same session
}

/**
 * Force reset all client data (for manual reset)
 */
export function forceResetClientData(): void {
  localStorage.removeItem(QUIZ_RESULTS_KEY);
  localStorage.removeItem(QUIZ_RESULTS_ALT_KEY);
  localStorage.removeItem(CHAT_HISTORY_KEY);
  sessionStorage.removeItem(CLIENT_SESSION_KEY);
  
  // Generate new session
  const newSessionId = generateSessionId();
  sessionStorage.setItem(CLIENT_SESSION_KEY, newSessionId);
  
  console.log('[ClientSession] Forced reset, new session:', newSessionId);
}

/**
 * Get current session ID
 */
export function getSessionId(): string | null {
  return sessionStorage.getItem(CLIENT_SESSION_KEY);
}
