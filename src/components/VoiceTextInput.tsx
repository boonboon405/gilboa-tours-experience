import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceTextInputProps {
  onSend: (message: string) => void;
  onTyping?: (text: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const VoiceTextInput = ({ 
  onSend, 
  onTyping, 
  isLoading = false, 
  placeholder = 'הקלידו או דברו...',
  disabled = false
}: VoiceTextInputProps) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'he-IL'; // Hebrew language

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        const newText = input + finalTranscript;
        setInput(newText);
        // Trigger real-time update
        if (onTyping) {
          onTyping(newText);
        }
      } else if (interimTranscript) {
        // Show interim results in real-time
        if (onTyping) {
          onTyping(input + interimTranscript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "נדרשת הרשאה",
          description: "אנא אפשרו גישה למיקרופון בדפדפן",
          variant: "destructive"
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [input, onTyping, toast]);

  const startListening = () => {
    if (!recognitionRef.current || isListening || disabled) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Immediately update typing preview if callback provided
    if (onTyping) {
      onTyping(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = input.trim();
    
    console.log('📤 Submitting message:', messageToSend);
    
    if (messageToSend && !isLoading && !disabled) {
      // Clear input immediately for better UX
      setInput('');
      
      // Clear typing preview
      if (onTyping) {
        onTyping('');
      }
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Send the message
      onSend(messageToSend);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-border/50 bg-background">
      {speechSupported && (
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={isListening ? stopListening : startListening}
          disabled={disabled || isLoading}
          className={isListening ? 'animate-pulse-slow' : ''}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>
      )}
      <Input
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className="flex-1 text-right"
        dir="rtl"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e as any);
          }
        }}
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={!input.trim() || isLoading || disabled}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
};
