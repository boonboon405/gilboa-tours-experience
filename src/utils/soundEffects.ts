/**
 * Sound Effects Utility
 * Provides audio feedback for user interactions
 */

// Sound URLs (using free sound effects)
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  complete: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  pop: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  notification: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
} as const;

type SoundType = keyof typeof SOUNDS;

// Cache audio elements for faster playback
const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};

// Sound enabled state (persisted)
let soundEnabled = localStorage.getItem('sound-enabled') !== 'false';

/**
 * Play a sound effect
 */
export function playSound(type: SoundType, volume: number = 0.3): void {
  if (!soundEnabled) return;
  
  try {
    // Use cached audio or create new
    let audio = audioCache[type];
    
    if (!audio) {
      audio = new Audio(SOUNDS[type]);
      audioCache[type] = audio;
    }
    
    // Reset and play
    audio.currentTime = 0;
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.play().catch(err => {
      // Silently fail if autoplay is blocked
      console.debug('[Sound] Autoplay blocked:', err.message);
    });
  } catch (error) {
    console.debug('[Sound] Error playing sound:', error);
  }
}

/**
 * Preload sounds for faster first playback
 */
export function preloadSounds(): void {
  Object.entries(SOUNDS).forEach(([key, url]) => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;
    audioCache[key as SoundType] = audio;
  });
}

/**
 * Toggle sound on/off
 */
export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  localStorage.setItem('sound-enabled', String(soundEnabled));
  
  if (soundEnabled) {
    playSound('pop', 0.2);
  }
  
  return soundEnabled;
}

/**
 * Check if sound is enabled
 */
export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Set sound enabled state
 */
export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  localStorage.setItem('sound-enabled', String(enabled));
}
