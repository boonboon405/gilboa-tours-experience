import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2 } from 'lucide-react';
import { ELEVENLABS_VOICES, ElevenLabsVoice } from '@/utils/elevenLabsTTS';

interface VoiceSelectorProps {
  selectedVoice: ElevenLabsVoice;
  onVoiceChange: (voice: ElevenLabsVoice) => void;
  className?: string;
}

export const VoiceSelector = ({ selectedVoice, onVoiceChange, className }: VoiceSelectorProps) => {
  return (
    <div className={className}>
      <Select value={selectedVoice} onValueChange={(value) => onVoiceChange(value as ElevenLabsVoice)}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <Volume2 className="h-3 w-3 ml-1" />
          <SelectValue placeholder="בחר קול" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ELEVENLABS_VOICES).map(([key, voice]) => (
            <SelectItem key={key} value={key} className="text-xs">
              <div className="flex flex-col">
                <span className="font-medium">{voice.name}</span>
                <span className="text-muted-foreground text-[10px]">{voice.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
