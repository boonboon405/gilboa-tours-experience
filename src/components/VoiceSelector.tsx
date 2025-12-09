import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Volume2, Play, Loader2, Square } from 'lucide-react';
import { ELEVENLABS_VOICES, ElevenLabsVoice, speakWithElevenLabs, stopElevenLabsSpeech } from '@/utils/elevenLabsTTS';

interface VoiceSelectorProps {
  selectedVoice: ElevenLabsVoice;
  onVoiceChange: (voice: ElevenLabsVoice) => void;
  className?: string;
}

// Preview text for voice demo
const PREVIEW_TEXT = 'שלום! אני כאן לעזור לכם לתכנן את החוויה המושלמת';

export const VoiceSelector = ({ selectedVoice, onVoiceChange, className }: VoiceSelectorProps) => {
  const [previewingVoice, setPreviewingVoice] = useState<ElevenLabsVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePreview = async (voice: ElevenLabsVoice, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // If already playing this voice, stop it
    if (previewingVoice === voice && isPlaying) {
      stopElevenLabsSpeech();
      setIsPlaying(false);
      setPreviewingVoice(null);
      return;
    }
    
    // Stop any current preview
    stopElevenLabsSpeech();
    
    setPreviewingVoice(voice);
    setIsPlaying(true);
    
    await speakWithElevenLabs(
      PREVIEW_TEXT,
      voice,
      () => {},
      () => {
        setIsPlaying(false);
        setPreviewingVoice(null);
      }
    );
  };

  return (
    <div className={className}>
      <Select value={selectedVoice} onValueChange={(value) => onVoiceChange(value as ElevenLabsVoice)}>
        <SelectTrigger className="w-full h-10 text-sm">
          <Volume2 className="h-4 w-4 ml-2 shrink-0" />
          <SelectValue placeholder="בחר קול" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {Object.entries(ELEVENLABS_VOICES).map(([key, voice]) => (
            <SelectItem key={key} value={key} className="py-2 pr-2">
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium">{voice.name}</span>
                  <span className="text-muted-foreground text-xs truncate">{voice.description}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 hover:bg-primary/10"
                  onClick={(e) => handlePreview(key as ElevenLabsVoice, e)}
                  title="השמע דוגמה"
                >
                  {previewingVoice === key && isPlaying ? (
                    <Square className="h-3 w-3 text-destructive" />
                  ) : previewingVoice === key ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3 text-primary" />
                  )}
                </Button>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
