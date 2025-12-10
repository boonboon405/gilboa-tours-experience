import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Check, Sparkles, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ELEVENLABS_VOICES, ElevenLabsVoice } from '@/utils/elevenLabsTTS';

interface EnhancedVoiceSelectorProps {
  selectedVoice: ElevenLabsVoice;
  onVoiceChange: (voice: ElevenLabsVoice) => void;
  language?: 'he' | 'en';
  className?: string;
}

const VOICE_PREVIEW_TEXT = {
  he: 'שלום, אני הסוכנת הדיגיטלית שלך. איך אוכל לעזור לך היום?',
  en: 'Hello, I am your digital agent. How can I help you today?'
};

export const EnhancedVoiceSelector: React.FC<EnhancedVoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
  language = 'he',
  className
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [previewingVoice, setPreviewingVoice] = useState<ElevenLabsVoice | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const t = (he: string, en: string) => language === 'he' ? he : en;

  const stopPreview = () => {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.src = '';
      setPreviewAudio(null);
    }
    setPreviewingVoice(null);
  };

  const playPreview = async (voice: ElevenLabsVoice) => {
    if (previewingVoice === voice) {
      stopPreview();
      return;
    }

    stopPreview();
    setPreviewingVoice(voice);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: VOICE_PREVIEW_TEXT[language],
          voice,
          language
        }
      });

      if (error) throw error;

      if (!data?.audioContent) {
        throw new Error('No audio content');
      }

      // Convert base64 to audio
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      setPreviewAudio(audio);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setPreviewingVoice(null);
        setPreviewAudio(null);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setPreviewingVoice(null);
        setPreviewAudio(null);
      };

      await audio.play();
    } catch (error) {
      console.error('Preview error:', error);
      setPreviewingVoice(null);
      toast({
        title: t('שגיאה בהשמעה', 'Preview Error'),
        description: t('לא ניתן להשמיע תצוגה מקדימה', 'Could not play preview'),
        variant: 'destructive'
      });
    }
  };

  const handleSelectVoice = (voice: ElevenLabsVoice) => {
    stopPreview();
    onVoiceChange(voice);
    localStorage.setItem('preferred-voice', voice);
    setIsOpen(false);
    toast({
      title: t('קול נבחר', 'Voice Selected'),
      description: ELEVENLABS_VOICES[voice].name,
    });
  };

  const femaleVoices = Object.entries(ELEVENLABS_VOICES).filter(([_, v]) => v.gender === 'female');
  const maleVoices = Object.entries(ELEVENLABS_VOICES).filter(([_, v]) => v.gender === 'male');

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) stopPreview();
        setIsOpen(open);
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{ELEVENLABS_VOICES[selectedVoice].name}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t('בחירת קול', 'Voice Selection')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Female voices */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('קולות נשיים', 'Female Voices')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {femaleVoices.map(([key, voice]) => (
                  <Card
                    key={key}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      selectedVoice === key && "border-primary bg-primary/5"
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-medium truncate">{voice.name}</span>
                            {selectedVoice === key && (
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{voice.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              playPreview(key as ElevenLabsVoice);
                            }}
                          >
                            {previewingVoice === key ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant={selectedVoice === key ? "default" : "outline"}
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleSelectVoice(key as ElevenLabsVoice)}
                      >
                        {selectedVoice === key ? t('נבחר', 'Selected') : t('בחר', 'Select')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Male voices */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('קולות גבריים', 'Male Voices')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {maleVoices.map(([key, voice]) => (
                  <Card
                    key={key}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      selectedVoice === key && "border-primary bg-primary/5"
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-medium truncate">{voice.name}</span>
                            {selectedVoice === key && (
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{voice.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              playPreview(key as ElevenLabsVoice);
                            }}
                          >
                            {previewingVoice === key ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant={selectedVoice === key ? "default" : "outline"}
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleSelectVoice(key as ElevenLabsVoice)}
                      >
                        {selectedVoice === key ? t('נבחר', 'Selected') : t('בחר', 'Select')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Current selection info */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{t('קול נוכחי:', 'Current voice:')}</span>
                <Badge variant="secondary">{ELEVENLABS_VOICES[selectedVoice].name}</Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedVoiceSelector;
