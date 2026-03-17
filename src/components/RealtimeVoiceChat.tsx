import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, PhoneOff, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface RealtimeVoiceChatProps {
  onClose: () => void;
}

export const RealtimeVoiceChat = ({ onClose }: RealtimeVoiceChatProps) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [isMicActive, setIsMicActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [agentText, setAgentText] = useState('');
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);

  const startSession = useCallback(async () => {
    setStatus('connecting');
    try {
      const { data, error } = await supabase.functions.invoke('generate-realtime-token', {
        body: { language: 'en' },
      });

      if (error || !data?.token) {
        throw new Error('Failed to get realtime token');
      }

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Set up audio playback
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      // Set up microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      setIsMicActive(true);

      // Data channel for events
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (event.type === 'response.audio_transcript.delta') {
            setAgentText((prev) => prev + (event.delta || ''));
          } else if (event.type === 'response.audio_transcript.done') {
            setAgentText(event.transcript || '');
          } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
            setTranscript(event.transcript || '');
          }
        } catch {}
      };

      // Create and set offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.token}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        }
      );

      if (!sdpResponse.ok) throw new Error('SDP exchange failed');

      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      setStatus('connected');
    } catch (err) {
      console.error('Realtime session error:', err);
      toast.error(t('voice.realtime.error'));
      setStatus('idle');
    }
  }, [t]);

  const endSession = useCallback(() => {
    dcRef.current?.close();
    pcRef.current?.close();
    pcRef.current = null;
    dcRef.current = null;
    setStatus('idle');
    setIsMicActive(false);
    setTranscript('');
    setAgentText('');
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Warning banner */}
      <div className="bg-accent/20 border-b border-border px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
        <AlertTriangle className="w-3.5 h-3.5 text-accent shrink-0" />
        <span>{t('voice.realtime.warning')}</span>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        {/* Mic indicator */}
        {status === 'connected' && (
          <motion.div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${isMicActive ? 'bg-destructive/20' : 'bg-muted'}`}
            animate={isMicActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {isMicActive ? <Mic className="w-8 h-8 text-destructive" /> : <MicOff className="w-8 h-8 text-muted-foreground" />}
          </motion.div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{t('voice.you.said')}</p>
            <p className="text-sm text-foreground">{transcript}</p>
          </div>
        )}

        {/* Agent text */}
        {agentText && (
          <div className="text-center max-w-[280px]">
            <p className="text-xs text-muted-foreground mb-1">{t('voice.agent.says')}</p>
            <p className="text-sm text-foreground">{agentText}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {status === 'idle' ? (
            <Button onClick={startSession} className="gap-2">
              <Phone className="w-4 h-4" />
              {t('voice.realtime.start')}
            </Button>
          ) : status === 'connecting' ? (
            <Button disabled className="gap-2">
              <span className="animate-pulse">{t('voice.realtime.connecting')}</span>
            </Button>
          ) : (
            <Button variant="destructive" onClick={endSession} className="gap-2">
              <PhoneOff className="w-4 h-4" />
              {t('voice.realtime.end')}
            </Button>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full" onClick={onClose}>
          {t('voice.back.to.chat')}
        </Button>
      </div>
    </div>
  );
};
