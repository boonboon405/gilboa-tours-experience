import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Loader2, User, Bot, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat, VOICE_OPTIONS, VoiceOption } from '@/utils/realtimeChat';
import { cn } from '@/lib/utils';

interface RealtimeVoiceChatProps {
  language: 'he' | 'en';
  onClose?: () => void;
}

const RealtimeVoiceChat: React.FC<RealtimeVoiceChatProps> = ({ language: initialLanguage, onClose }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Load saved preferences
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(() => {
    const saved = localStorage.getItem('preferred-realtime-voice');
    return (saved as VoiceOption) || 'alloy';
  });
  const [selectedLanguage, setSelectedLanguage] = useState<'he' | 'en'>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved === 'en' ? 'en' : saved === 'he' ? 'he' : initialLanguage);
  });
  
  // Transcripts
  const [userTranscripts, setUserTranscripts] = useState<string[]>([]);
  const [agentTranscript, setAgentTranscript] = useState('');
  const [liveUserSpeech, setLiveUserSpeech] = useState('');
  
  const chatRef = useRef<RealtimeChat | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  
  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('preferred-realtime-voice', selectedVoice);
  }, [selectedVoice]);
  
  useEffect(() => {
    localStorage.setItem('preferred-language', selectedLanguage);
  }, [selectedLanguage]);

  // Helper for localized text
  const t = (he: string, en: string) => selectedLanguage === 'he' ? he : en;

  // Auto-scroll transcripts
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [userTranscripts, agentTranscript, liveUserSpeech]);

  const handleMessage = useCallback((event: any) => {
    console.log('Realtime event:', event.type);
  }, []);

  const handleSpeakingChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
  }, []);

  const handleListeningChange = useCallback((listening: boolean) => {
    setIsListening(listening);
  }, []);

  const handleTranscript = useCallback((text: string, isUserFinal: boolean) => {
    if (isUserFinal) {
      setUserTranscripts(prev => [...prev, text]);
      setLiveUserSpeech('');
    } else {
      setAgentTranscript(prev => prev + text);
    }
  }, []);

  const handlePartialTranscript = useCallback((text: string) => {
    setLiveUserSpeech(text);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('Realtime error:', error);
    toast({
      title: selectedLanguage === 'he' ? 'שגיאה בשיחה' : 'Call Error',
      description: error.message,
      variant: 'destructive'
    });
  }, [selectedLanguage, toast]);

  const startCall = async () => {
    setIsConnecting(true);
    setUserTranscripts([]);
    setAgentTranscript('');
    setLiveUserSpeech('');
    
    try {
      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (permissionError) {
        toast({
          title: t('שגיאה בגישה למיקרופון', 'Microphone Access Error'),
          description: t('יש לאשר גישה למיקרופון', 'Please allow microphone access'),
          variant: 'destructive'
        });
        setIsConnecting(false);
        return;
      }
      
      chatRef.current = new RealtimeChat({
        onMessage: handleMessage,
        onSpeakingChange: handleSpeakingChange,
        onListeningChange: handleListeningChange,
        onTranscript: handleTranscript,
        onPartialTranscript: handlePartialTranscript,
        onError: handleError
      });
      
      await chatRef.current.init(selectedLanguage, selectedVoice);
      setIsConnected(true);
      
      toast({
        title: t('מחובר', 'Connected'),
        description: t('השיחה הקולית פעילה', 'Voice call is active'),
      });
    } catch (error) {
      console.error('Error starting call:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start call';
      toast({
        title: t('שגיאה בהתחלת השיחה', 'Error Starting Call'),
        description: errorMessage,
        variant: 'destructive'
      });
      
      // Clean up on error
      if (chatRef.current) {
        chatRef.current.disconnect();
        chatRef.current = null;
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    chatRef.current?.disconnect();
    chatRef.current = null;
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
    
    toast({
      title: t('השיחה הסתיימה', 'Call Ended'),
    });
    
    onClose?.();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto bg-background/95 backdrop-blur border-primary/20">
      <CardContent className="p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {t('שיחה קולית בזמן אמת', 'Real-time Voice Call')}
          </h3>
        </div>

        {/* Settings - Only show before connection */}
        {!isConnected && !isConnecting && (
          <div className="space-y-4 mb-4">
            {/* Language Selector */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Globe className="w-4 h-4" />
                {t('שפת השיחה:', 'Call Language:')}
              </label>
              <div className="flex gap-2">
                <Button
                  variant={selectedLanguage === 'he' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLanguage('he')}
                  className="flex-1"
                >
                  🇮🇱 עברית
                </Button>
                <Button
                  variant={selectedLanguage === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLanguage('en')}
                  className="flex-1"
                >
                  🇺🇸 English
                </Button>
              </div>
            </div>

            {/* Voice Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('קול הסוכן:', 'Agent Voice:')}
              </label>
              <Select value={selectedVoice} onValueChange={(v) => setSelectedVoice(v as VoiceOption)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {selectedLanguage === 'he' ? voice.nameHe : voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Status Display */}
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            {isConnecting && t('מתחבר...', 'Connecting...')}
            {isConnected && !isSpeaking && !isListening && t('מחובר - דבר עכשיו', 'Connected - Speak now')}
            {isListening && t('🎤 מקשיב לך...', '🎤 Listening to you...')}
            {isSpeaking && t('🔊 הסוכן מדבר...', '🔊 Agent speaking...')}
          </p>
        </div>

        {/* Visual Indicator */}
        <div className="flex justify-center mb-4">
          <div className={cn(
            "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
            isConnected ? "bg-primary/20" : "bg-muted",
            isSpeaking && "animate-pulse bg-green-500/30",
            isListening && "bg-blue-500/30"
          )}>
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full border-2 border-blue-400 animate-ping opacity-50 animation-delay-150" />
              </>
            )}
            
            {isSpeaking && (
              <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-pulse" />
            )}
            
            <div className={cn(
              "z-10 p-3 rounded-full",
              isConnected ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
            )}>
              {isConnecting ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isListening ? (
                <Mic className="w-8 h-8 animate-bounce" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8" />
              ) : isConnected ? (
                <Phone className="w-8 h-8" />
              ) : (
                <PhoneOff className="w-8 h-8" />
              )}
            </div>
          </div>
        </div>

        {/* Live User Speech */}
        {isListening && liveUserSpeech && (
          <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg animate-pulse">
            <div className="flex items-center gap-2 mb-1">
              <Mic className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-blue-500">
                {t('מה שהסוכן שומע עכשיו:', 'What agent hears now:')}
              </span>
            </div>
            <p className="text-sm text-foreground">{liveUserSpeech}</p>
          </div>
        )}

        {/* Conversation Transcripts */}
        {(userTranscripts.length > 0 || agentTranscript) && (
          <div 
            ref={transcriptRef}
            className="mb-4 p-3 bg-muted/50 rounded-lg max-h-40 overflow-y-auto space-y-2"
          >
            {userTranscripts.map((text, index) => (
              <div key={index} className="flex items-start gap-2">
                <User className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
            {agentTranscript && (
              <div className="flex items-start gap-2">
                <Bot className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p className="text-sm">{agentTranscript}</p>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isConnected ? (
            <Button
              onClick={startCall}
              disabled={isConnecting}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('מתחבר...', 'Connecting...')}
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5 mr-2" />
                  {t('התחל שיחה', 'Start Call')}
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={toggleMute}
                variant="outline"
                size="lg"
                className={cn(isMuted && "bg-destructive/20 border-destructive")}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={endCall}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8"
                size="lg"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                {t('סיים שיחה', 'End Call')}
              </Button>
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          {t(
            'שיחה קולית בזמן אמת - דבר בחופשיות והסוכן ישמע ויענה',
            'Real-time voice call - speak freely and the agent will listen and respond'
          )}
        </p>
        
        {/* Hebrew Limitation Notice */}
        {selectedLanguage === 'he' && !isConnected && (
          <p className="text-xs text-center text-amber-500 mt-2">
            ⚠️ הערה: הסוכן יבין עברית אך ישיב באנגלית (מגבלת המערכת)
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeVoiceChat;