import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/realtimeChat';
import { cn } from '@/lib/utils';

interface RealtimeVoiceChatProps {
  language: 'he' | 'en';
  onClose?: () => void;
}

const RealtimeVoiceChat: React.FC<RealtimeVoiceChatProps> = ({ language, onClose }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [agentTranscript, setAgentTranscript] = useState('');
  
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = useCallback((event: any) => {
    console.log('Realtime event:', event.type);
  }, []);

  const handleSpeakingChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
  }, []);

  const handleListeningChange = useCallback((listening: boolean) => {
    setIsListening(listening);
  }, []);

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      setTranscript(prev => prev + ' ' + text);
    } else {
      setAgentTranscript(prev => prev + text);
    }
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('Realtime error:', error);
    toast({
      title: language === 'he' ? 'שגיאה בשיחה' : 'Call Error',
      description: error.message,
      variant: 'destructive'
    });
  }, [language, toast]);

  const startCall = async () => {
    setIsConnecting(true);
    setTranscript('');
    setAgentTranscript('');
    
    try {
      chatRef.current = new RealtimeChat({
        onMessage: handleMessage,
        onSpeakingChange: handleSpeakingChange,
        onListeningChange: handleListeningChange,
        onTranscript: handleTranscript,
        onError: handleError
      });
      
      await chatRef.current.init(language);
      setIsConnected(true);
      
      toast({
        title: language === 'he' ? 'מחובר' : 'Connected',
        description: language === 'he' ? 'השיחה הקולית פעילה' : 'Voice call is active',
      });
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to start call',
        variant: 'destructive'
      });
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
      title: language === 'he' ? 'השיחה הסתיימה' : 'Call Ended',
    });
    
    onClose?.();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Actually mute the audio track
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto bg-background/95 backdrop-blur border-primary/20">
      <CardContent className="p-6">
        {/* Status Display */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {language === 'he' ? 'שיחה קולית בזמן אמת' : 'Real-time Voice Call'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isConnecting && (language === 'he' ? 'מתחבר...' : 'Connecting...')}
            {isConnected && !isSpeaking && !isListening && (language === 'he' ? 'מחובר - דבר עכשיו' : 'Connected - Speak now')}
            {isListening && (language === 'he' ? 'מקשיב לך...' : 'Listening to you...')}
            {isSpeaking && (language === 'he' ? 'הסוכן מדבר...' : 'Agent speaking...')}
          </p>
        </div>

        {/* Visual Indicator */}
        <div className="flex justify-center mb-6">
          <div className={cn(
            "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
            isConnected ? "bg-primary/20" : "bg-muted",
            isSpeaking && "animate-pulse bg-green-500/30",
            isListening && "bg-blue-500/30"
          )}>
            {/* Microphone Animation Rings */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full border-2 border-blue-400 animate-ping opacity-50 animation-delay-150" />
                <div className="absolute inset-4 rounded-full border-2 border-blue-300 animate-ping opacity-25 animation-delay-300" />
              </>
            )}
            
            {/* Speaking Animation */}
            {isSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-pulse" />
                <div className="absolute inset-4 rounded-full border-2 border-green-400 animate-pulse animation-delay-150" />
              </>
            )}
            
            {/* Center Icon */}
            <div className={cn(
              "z-10 p-4 rounded-full",
              isConnected ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
            )}>
              {isConnecting ? (
                <Loader2 className="w-12 h-12 animate-spin" />
              ) : isListening ? (
                <Mic className="w-12 h-12 animate-bounce" />
              ) : isSpeaking ? (
                <Volume2 className="w-12 h-12" />
              ) : isConnected ? (
                <Phone className="w-12 h-12" />
              ) : (
                <PhoneOff className="w-12 h-12" />
              )}
            </div>
          </div>
        </div>

        {/* Transcripts */}
        {(transcript || agentTranscript) && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg max-h-32 overflow-y-auto">
            {transcript && (
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">{language === 'he' ? 'אתה:' : 'You:'}</span> {transcript.trim()}
              </p>
            )}
            {agentTranscript && (
              <p className="text-sm">
                <span className="font-medium">{language === 'he' ? 'סוכן:' : 'Agent:'}</span> {agentTranscript}
              </p>
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
                  {language === 'he' ? 'מתחבר...' : 'Connecting...'}
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'he' ? 'התחל שיחה' : 'Start Call'}
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
                {isMuted ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>
              
              <Button
                onClick={endCall}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8"
                size="lg"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                {language === 'he' ? 'סיים שיחה' : 'End Call'}
              </Button>
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          {language === 'he' 
            ? 'שיחה דו-כיוונית בזמן אמת - דבר בחופשיות והסוכן ישמע אותך' 
            : 'Real-time two-way conversation - speak freely and the agent will hear you'}
        </p>
      </CardContent>
    </Card>
  );
};

export default RealtimeVoiceChat;
