import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

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
  placeholder,
  disabled = false
}: VoiceTextInputProps) => {
  const { language } = useLanguage();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  const isHebrew = language === 'he';
  const defaultPlaceholder = isHebrew ? 'הקלידו או דברו...' : 'Type or speak...';

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    // Set language based on current app language
    recognition.lang = isHebrew ? 'he-IL' : 'en-US';

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
        if (onTyping) {
          onTyping(newText);
        }
      } else if (interimTranscript) {
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
          title: isHebrew ? "נדרשת הרשאה" : "Permission required",
          description: isHebrew ? "אנא אפשרו גישה למיקרופון בדפדפן" : "Please allow microphone access in your browser",
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
  }, [input, onTyping, toast, isHebrew]);

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
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (onTyping) {
      onTyping(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = input.trim();
    
    if (messageToSend && !isLoading && !disabled) {
      setInput('');
      
      if (onTyping) {
        onTyping('');
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
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
        placeholder={placeholder || defaultPlaceholder}
        disabled={disabled || isLoading}
        className="flex-1"
        dir={isHebrew ? 'rtl' : 'ltr'}
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
