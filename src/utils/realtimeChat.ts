import { supabase } from "@/integrations/supabase/client";

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      console.log('Audio recorder started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    console.log('Audio recorder stopped');
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

export interface RealtimeChatCallbacks {
  onMessage: (event: any) => void;
  onSpeakingChange: (speaking: boolean) => void;
  onListeningChange: (listening: boolean) => void;
  onTranscript: (text: string, isFinal: boolean) => void;
  onPartialTranscript?: (text: string) => void; // Real-time partial user speech
  onError: (error: Error) => void;
}

export type VoiceOption = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';

export const VOICE_OPTIONS: { id: VoiceOption; name: string; nameHe: string }[] = [
  { id: 'alloy', name: 'Alloy', nameHe: 'אלוי' },
  { id: 'ash', name: 'Ash', nameHe: 'אש' },
  { id: 'ballad', name: 'Ballad', nameHe: 'בלאד' },
  { id: 'coral', name: 'Coral', nameHe: 'קורל' },
  { id: 'echo', name: 'Echo', nameHe: 'אקו' },
  { id: 'sage', name: 'Sage', nameHe: 'סייג' },
  { id: 'shimmer', name: 'Shimmer', nameHe: 'שימר' },
  { id: 'verse', name: 'Verse', nameHe: 'ורס' },
];

export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private recorder: AudioRecorder | null = null;
  private callbacks: RealtimeChatCallbacks;
  private currentLanguage: string = 'he';
  private currentVoice: VoiceOption = 'alloy';

  constructor(callbacks: RealtimeChatCallbacks) {
    this.callbacks = callbacks;
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  async init(language: string = 'he', voice: VoiceOption = 'alloy') {
    this.currentLanguage = language;
    this.currentVoice = voice;
    
    try {
      console.log('Initializing realtime chat...');
      
      // Get ephemeral token from our Supabase Edge Function
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke("realtime-session", {
        body: { language, voice }
      });

      if (tokenError) {
        console.error('Token error:', tokenError);
        throw new Error(tokenError.message || "Failed to get session token");
      }

      if (!tokenData?.client_secret?.value) {
        console.error('Invalid token response:', tokenData);
        throw new Error("Failed to get ephemeral token");
      }

      const EPHEMERAL_KEY = tokenData.client_secret.value;
      console.log('Got ephemeral token');

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up remote audio
      this.pc.ontrack = e => {
        console.log('Received audio track');
        this.audioEl.srcObject = e.streams[0];
      };

      // Add local audio track
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.pc.addTrack(ms.getTracks()[0]);
      console.log('Added local audio track');

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      
      this.dc.addEventListener("open", () => {
        console.log('Data channel opened');
        this.callbacks.onListeningChange(true);
      });

      this.dc.addEventListener("close", () => {
        console.log('Data channel closed');
        this.callbacks.onListeningChange(false);
      });

      this.dc.addEventListener("message", (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log("Realtime event:", event.type);
          this.handleEvent(event);
          
          // Send session.update after session.created to configure audio transcription
          if (event.type === 'session.created') {
            this.sendSessionUpdate();
          }
        } catch (parseError) {
          console.error("Error parsing realtime event:", parseError);
        }
      });

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      
      console.log('Connecting to OpenAI Realtime API...');
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error('SDP response error:', sdpResponse.status, errorText);
        throw new Error(`Failed to connect: ${sdpResponse.status}`);
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established");

    } catch (error) {
      console.error("Error initializing chat:", error);
      this.callbacks.onError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  private sendSessionUpdate() {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.error('Cannot send session update - data channel not ready');
      return;
    }

    const systemInstructions = this.currentLanguage === 'he' 
      ? `CRITICAL LANGUAGE INSTRUCTION: You MUST speak ONLY in Hebrew (עברית). Do NOT speak in any other language under any circumstances. Every single word you say must be in Hebrew.

אתה סוכן סיורים מקצועי המתמחה בצפון ישראל - גליל, כנרת, הרי הגלבוע ועמק המעיינות.

הוראות שפה קריטיות:
- דבר אך ורק בעברית
- אל תשתמש במילים באנגלית או בשפה אחרת
- השתמש בעברית רשמית וברורה
- אל תשתמש בסלנג

היה ידידותי, מקצועי ומסביר פנים. עזור למבקרים לתכנן סיורים והמלץ על אטרקציות ופעילויות בצפון הארץ.

זכור: כל מילה שתאמר חייבת להיות בעברית בלבד!`
      : `You are a professional tour agent specializing in Northern Israel - Galilee, Sea of Galilee, Gilboa Mountains, and Springs Valley.
         
CRITICAL: You MUST speak ONLY in English. Do NOT use any other language.
         
Be friendly, professional, and helpful. Help visitors plan tours and recommend attractions and activities.`;

    const sessionUpdate = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: systemInstructions,
        voice: this.currentVoice,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 1000
        },
        temperature: 0.8,
        max_response_output_tokens: 'inf'
      }
    };

    console.log('Sending session.update for audio transcription...');
    this.dc.send(JSON.stringify(sessionUpdate));
  }

  private handleEvent(event: any) {
    this.callbacks.onMessage(event);

    switch (event.type) {
      case 'session.updated':
        console.log('Session updated successfully');
        break;
      
      case 'response.audio.delta':
        this.callbacks.onSpeakingChange(true);
        break;
      
      case 'response.audio.done':
        this.callbacks.onSpeakingChange(false);
        break;
      
      case 'input_audio_buffer.speech_started':
        console.log('User started speaking');
        this.callbacks.onListeningChange(true);
        this.callbacks.onPartialTranscript?.(''); // Clear partial transcript
        break;
      
      case 'input_audio_buffer.speech_stopped':
        console.log('User stopped speaking');
        break;
      
      case 'response.audio_transcript.delta':
        if (event.delta) {
          this.callbacks.onTranscript(event.delta, false);
        }
        break;
      
      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript) {
          console.log('User said:', event.transcript);
          this.callbacks.onTranscript(event.transcript, true);
        }
        break;
      
      case 'conversation.item.input_audio_transcription.failed':
        console.error('Transcription failed:', event.error);
        break;
      
      case 'response.audio_transcript.delta':
        if (event.delta) {
          this.callbacks.onTranscript(event.delta, false);
        }
        break;
      
      case 'error':
        console.error('Realtime API error:', event.error);
        this.callbacks.onError(new Error(event.error?.message || 'Unknown error'));
        break;
    }
  }

  sendTextMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({ type: 'response.create' }));
  }

  disconnect() {
    console.log('Disconnecting realtime chat...');
    this.recorder?.stop();
    
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    
    if (this.audioEl.srcObject) {
      (this.audioEl.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      this.audioEl.srcObject = null;
    }
    
    this.callbacks.onListeningChange(false);
    this.callbacks.onSpeakingChange(false);
  }

  isConnected(): boolean {
    return this.dc?.readyState === 'open';
  }
}
