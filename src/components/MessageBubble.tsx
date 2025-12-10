import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, Volume2, VolumeX, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MessageBubbleProps {
  sender: 'user' | 'ai';
  message: string;
  timestamp?: string;
  sentiment?: {
    type: 'positive' | 'neutral' | 'negative';
    icon: string;
    color: string;
  };
  isPlaying?: boolean;
  onPlayAudio?: () => void;
  onStopAudio?: () => void;
  language?: 'he' | 'en';
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  message,
  timestamp,
  sentiment,
  isPlaying = false,
  onPlayAudio,
  onStopAudio,
  language = 'he',
  className
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const isUser = sender === 'user';
  const t = (he: string, en: string) => language === 'he' ? he : en;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast({
        title: t('הועתק', 'Copied'),
        description: t('הטקסט הועתק ללוח', 'Text copied to clipboard'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 group animate-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
        isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-primary/20 to-primary/10"
      )}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Message content */}
      <div className={cn(
        "max-w-[80%] sm:max-w-[70%] space-y-1",
        isUser ? "items-end" : "items-start"
      )}>
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border rounded-tl-sm"
          )}
        >
          {/* Sentiment indicator for user messages */}
          {isUser && sentiment && (
            <span className="absolute -top-2 -right-2 text-lg">{sentiment.icon}</span>
          )}
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message}</p>

          {/* Action buttons for AI messages */}
          {!isUser && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
              {onPlayAudio && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isPlaying ? onStopAudio : onPlayAudio}
                  className="h-7 px-2 text-xs"
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-3 h-3 mr-1" />
                      {t('עצור', 'Stop')}
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3 mr-1" />
                      {t('השמע', 'Play')}
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    {t('הועתק', 'Copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    {t('העתק', 'Copy')}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className={cn(
            "text-[10px] text-muted-foreground px-2",
            isUser ? "text-right" : "text-left"
          )}>
            {new Date(timestamp).toLocaleTimeString(language === 'he' ? 'he-IL' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
