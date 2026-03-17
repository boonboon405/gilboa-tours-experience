import { useState, useRef, useCallback } from 'react';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAudioUrlRef = useRef<string | null>(null);

  const speak = useCallback(async (text: string, voice = 'Rachel') => {
    try {
      stop();
      setIsSpeaking(true);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, voice }),
        }
      );

      if (!response.ok) throw new Error('TTS failed');

      const data = await response.json();
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      lastAudioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const replay = useCallback(() => {
    if (lastAudioUrlRef.current) {
      stop();
      setIsSpeaking(true);
      const audio = new Audio(lastAudioUrlRef.current);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      audio.play();
    }
  }, [stop]);

  return { speak, stop, replay, isSpeaking, hasLastAudio: !!lastAudioUrlRef.current };
};
