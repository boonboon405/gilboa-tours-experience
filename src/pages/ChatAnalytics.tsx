import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AnalyticsData {
  totalConversations: number;
  totalMessages: number;
  aiMessages: number;
  humanMessages: number;
  avgConfidenceScore: number;
  lowConfidenceCount: number;
  highConfidenceCount: number;
  activeConversations: number;
  resolvedConversations: number;
}

const ChatAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalConversations: 0,
    totalMessages: 0,
    aiMessages: 0,
    humanMessages: 0,
    avgConfidenceScore: 0,
    lowConfidenceCount: 0,
    highConfidenceCount: 0,
    activeConversations: 0,
    resolvedConversations: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get conversations stats
      const { data: conversations } = await supabase
        .from('live_chat_conversations')
        .select('status');

      // Get messages stats
      const { data: messages } = await supabase
        .from('live_chat_messages')
        .select('sender_name, ai_confidence_score');

      if (conversations && messages) {
        const aiMessages = messages.filter(m => m.sender_name === 'AI Assistant');
        const humanMessages = messages.filter(m => m.sender_name !== 'AI Assistant' && m.sender_name !== null);
        
        const confidenceScores = aiMessages
          .map(m => m.ai_confidence_score)
          .filter(score => score !== null) as number[];
        
        const avgConfidence = confidenceScores.length > 0
          ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
          : 0;

        setAnalytics({
          totalConversations: conversations.length,
          totalMessages: messages.length,
          aiMessages: aiMessages.length,
          humanMessages: humanMessages.length,
          avgConfidenceScore: avgConfidence,
          lowConfidenceCount: confidenceScores.filter(s => s < 0.4).length,
          highConfidenceCount: confidenceScores.filter(s => s >= 0.7).length,
          activeConversations: conversations.filter(c => c.status === 'active').length,
          resolvedConversations: conversations.filter(c => c.status === 'resolved').length,
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    color = "text-primary" 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    description?: string;
    color?: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-primary/10 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">אנליטיקת צ'אט AI</h1>
            <p className="text-muted-foreground">מעקב אחר ביצועי המערכת ושיחות</p>
          </div>
          <Button onClick={() => navigate('/admin-chat')}>
            חזרה לצ'אט
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="סה״כ שיחות"
            value={analytics.totalConversations}
            icon={Users}
            description="כל השיחות במערכת"
          />
          <StatCard
            title="הודעות AI"
            value={analytics.aiMessages}
            icon={Brain}
            description={`${Math.round((analytics.aiMessages / Math.max(analytics.totalMessages, 1)) * 100)}% מכלל ההודעות`}
            color="text-blue-500"
          />
          <StatCard
            title="ממוצע ביטחון AI"
            value={`${Math.round(analytics.avgConfidenceScore * 100)}%`}
            icon={TrendingUp}
            description="ביטחון ממוצע בתשובות AI"
            color="text-green-500"
          />
          <StatCard
            title="שיחות פעילות"
            value={analytics.activeConversations}
            icon={MessageCircle}
            description="דורשות תשומת לב"
            color="text-orange-500"
          />
        </div>

        {/* AI Performance */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              ביצועי AI
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-semibold">ביטחון גבוה</p>
                    <p className="text-sm text-muted-foreground">70% ומעלה</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{analytics.highConfidenceCount}</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-semibold">ביטחון נמוך</p>
                    <p className="text-sm text-muted-foreground">מתחת ל-40%</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{analytics.lowConfidenceCount}</p>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">שיעור הצלחה AI</span>
                  <span className="font-semibold">
                    {analytics.aiMessages > 0 
                      ? `${Math.round((analytics.highConfidenceCount / analytics.aiMessages) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ 
                      width: analytics.aiMessages > 0 
                        ? `${(analytics.highConfidenceCount / analytics.aiMessages) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              סטטוס שיחות
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">פעילות</p>
                    <p className="text-sm text-muted-foreground">דורשות מענה</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{analytics.activeConversations}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-semibold">נפתרו</p>
                    <p className="text-sm text-muted-foreground">הושלמו בהצלחה</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{analytics.resolvedConversations}</p>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">שיעור סגירה</span>
                  <span className="font-semibold">
                    {analytics.totalConversations > 0
                      ? `${Math.round((analytics.resolvedConversations / analytics.totalConversations) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ 
                      width: analytics.totalConversations > 0
                        ? `${(analytics.resolvedConversations / analytics.totalConversations) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            תובנות מרכזיות
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">תגובות אוטומטיות</p>
              <p className="text-2xl font-bold">
                {Math.round((analytics.aiMessages / Math.max(analytics.totalMessages, 1)) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">מכלל ההודעות</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">התערבות אנושית</p>
              <p className="text-2xl font-bold">
                {Math.round((analytics.humanMessages / Math.max(analytics.totalMessages, 1)) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">מכלל ההודעות</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">ממוצע הודעות לשיחה</p>
              <p className="text-2xl font-bold">
                {analytics.totalConversations > 0 
                  ? Math.round(analytics.totalMessages / analytics.totalConversations)
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">הודעות</p>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ChatAnalytics;
