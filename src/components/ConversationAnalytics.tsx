import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  created_at: string;
}

interface ConversationAnalyticsProps {
  messages: Message[];
  startTime: Date;
  conversationData: any;
}

export const ConversationAnalytics = ({ 
  messages, 
  startTime,
  conversationData 
}: ConversationAnalyticsProps) => {
  const [analytics, setAnalytics] = useState({
    duration: '0:00',
    messageCount: 0,
    userMessages: 0,
    aiMessages: 0,
    avgResponseTime: 0,
    completionRate: 0,
    engagementScore: 0
  });

  useEffect(() => {
    const calculateAnalytics = () => {
      const now = new Date();
      const durationMs = now.getTime() - startTime.getTime();
      const durationMin = Math.floor(durationMs / 60000);
      const durationSec = Math.floor((durationMs % 60000) / 1000);
      const duration = `${durationMin}:${durationSec.toString().padStart(2, '0')}`;

      const userMessages = messages.filter(m => m.sender === 'user').length;
      const aiMessages = messages.filter(m => m.sender === 'ai').length;
      const messageCount = messages.length;

      // Calculate average response time (time between user message and AI response)
      let totalResponseTime = 0;
      let responseCount = 0;
      for (let i = 0; i < messages.length - 1; i++) {
        if (messages[i].sender === 'user' && messages[i + 1].sender === 'ai') {
          const userTime = new Date(messages[i].created_at).getTime();
          const aiTime = new Date(messages[i + 1].created_at).getTime();
          totalResponseTime += (aiTime - userTime);
          responseCount++;
        }
      }
      const avgResponseTime = responseCount > 0 ? Math.round(totalResponseTime / responseCount / 1000) : 0;

      // Calculate completion rate based on collected data
      const requiredFields = ['categories', 'numberOfPeople', 'dates', 'budget'];
      const completedFields = requiredFields.filter(field => conversationData[field]).length;
      const completionRate = Math.round((completedFields / requiredFields.length) * 100);

      // Calculate engagement score based on message length and frequency
      const avgMessageLength = userMessages > 0 
        ? messages.filter(m => m.sender === 'user').reduce((sum, m) => sum + m.message.length, 0) / userMessages 
        : 0;
      const engagementScore = Math.min(100, Math.round(
        (userMessages * 10) + (avgMessageLength / 10) + (completionRate * 0.5)
      ));

      setAnalytics({
        duration,
        messageCount,
        userMessages,
        aiMessages,
        avgResponseTime,
        completionRate,
        engagementScore
      });
    };

    const interval = setInterval(calculateAnalytics, 1000);
    calculateAnalytics(); // Initial calculation

    return () => clearInterval(interval);
  }, [messages, startTime, conversationData]);

  return (
    <Card className="p-4 bg-muted/30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">זמן שיחה</div>
            <div className="text-lg font-bold">{analytics.duration}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">הודעות</div>
            <div className="text-lg font-bold">{analytics.messageCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">השלמה</div>
            <div className="text-lg font-bold">{analytics.completionRate}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">מעורבות</div>
            <div className="text-lg font-bold">
              {analytics.engagementScore}
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {analytics.userMessages} תשובות שלך
          </Badge>
          <Badge variant="outline" className="text-xs">
            {analytics.aiMessages} תשובות AI
          </Badge>
          {analytics.avgResponseTime > 0 && (
            <Badge variant="outline" className="text-xs">
              ⚡ {analytics.avgResponseTime}s זמן תגובה ממוצע
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
