import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Save, Eye, EyeOff, History, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

const SETTINGS_PASSWORD = 'odt2025'; // Simple password protection

interface AIPrompt {
  id: string;
  prompt_key: string;
  prompt_text: string;
  description: string;
}

interface PromptVersion {
  id: string;
  prompt_text: string;
  changed_by: string | null;
  change_note: string | null;
  created_at: string;
}

const AISettings = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPromptHistory, setSelectedPromptHistory] = useState<string | null>(null);
  const [versionHistory, setVersionHistory] = useState<PromptVersion[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isUnlocked) {
      loadPrompts();
    }
  }, [isUnlocked]);

  const loadPrompts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ai_prompts')
      .select('*')
      .order('prompt_key');

    if (error) {
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לטעון את ההגדרות',
        variant: 'destructive',
      });
    } else {
      setPrompts(data || []);
    }
    setLoading(false);
  };

  const handleUnlock = () => {
    if (password === SETTINGS_PASSWORD) {
      setIsUnlocked(true);
      toast({
        title: 'התחברות מצליחה',
        description: 'ניתן כעת לערוך את טקסטי ה-AI',
      });
    } else {
      toast({
        title: 'סיסמה שגויה',
        description: 'נסה שוב',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (promptId: string, newText: string) => {
    const { error } = await supabase
      .from('ai_prompts')
      .update({ prompt_text: newText })
      .eq('id', promptId);

    if (error) {
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לשמור את השינויים',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'נשמר בהצלחה',
        description: 'הטקסט עודכן והגרסה הקודמת נשמרה בהיסטוריה',
      });
      loadPrompts();
    }
  };

  const loadVersionHistory = async (promptId: string) => {
    setLoadingHistory(true);
    setSelectedPromptHistory(promptId);
    
    const { data, error } = await supabase
      .from('ai_prompt_versions')
      .select('*')
      .eq('prompt_id', promptId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לטעון את ההיסטוריה',
        variant: 'destructive',
      });
    } else {
      setVersionHistory(data || []);
    }
    setLoadingHistory(false);
  };

  const restoreVersion = async (promptId: string, versionText: string) => {
    const { error } = await supabase
      .from('ai_prompts')
      .update({ prompt_text: versionText })
      .eq('id', promptId);

    if (error) {
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לשחזר את הגרסה',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'שוחזר בהצלחה',
        description: 'הטקסט שוחזר לגרסה קודמת',
      });
      setSelectedPromptHistory(null);
      loadPrompts();
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle>הגדרות AI - כניסה מוגנת</CardTitle>
            <CardDescription>הזן סיסמה לעריכת טקסטי ה-AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button onClick={handleUnlock} className="w-full">
              כניסה
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">הגדרות טקסטי AI</h1>
          <p className="text-muted-foreground">ערוך את טקסטי ה-AI המשמשים בצ'אט ובתמיכה החיה</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">טוען...</p>
          </div>
        ) : (
          prompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <CardTitle>
                  {prompt.prompt_key === 'live_chat' ? 'צ\'אט תמיכה חיה' : 'עוזר טיולים AI'}
                </CardTitle>
                <CardDescription>{prompt.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prompt.prompt_text}
                  onChange={(e) => {
                    const updated = prompts.map((p) =>
                      p.id === prompt.id ? { ...p, prompt_text: e.target.value } : p
                    );
                    setPrompts(updated);
                  }}
                  rows={15}
                  className="font-mono text-sm"
                  dir="rtl"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSave(prompt.id, prompt.prompt_text)}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    שמור שינויים
                  </Button>
                  <Button
                    onClick={() => loadVersionHistory(prompt.id)}
                    variant="outline"
                  >
                    <History className="w-4 h-4 ml-2" />
                    היסטוריה
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Version History Dialog */}
      <Dialog open={selectedPromptHistory !== null} onOpenChange={() => setSelectedPromptHistory(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>היסטוריית שינויים</DialogTitle>
            <DialogDescription>
              כל השינויים שבוצעו בטקסט נשמרים אוטומטית. ניתן לשחזר כל גרסה קודמת.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[500px] pr-4">
            {loadingHistory ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">טוען היסטוריה...</p>
              </div>
            ) : versionHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">אין שינויים קודמים</p>
              </div>
            ) : (
              <div className="space-y-4">
                {versionHistory.map((version, index) => (
                  <Card key={version.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">
                          גרסה מ-{format(new Date(version.created_at), 'dd/MM/yyyy HH:mm')}
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const promptId = selectedPromptHistory;
                            if (promptId) {
                              restoreVersion(promptId, version.prompt_text);
                            }
                          }}
                        >
                          <RotateCcw className="w-3 h-3 ml-1" />
                          שחזר גרסה זו
                        </Button>
                      </div>
                      {version.change_note && (
                        <CardDescription className="text-xs">
                          {version.change_note}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-3 rounded-md">
                        <pre className="text-xs whitespace-pre-wrap font-mono" dir="rtl">
                          {version.prompt_text}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AISettings;
