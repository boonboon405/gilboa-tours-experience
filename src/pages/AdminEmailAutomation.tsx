import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailSequence {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  is_active: boolean;
  created_at: string;
}

interface EmailQueueItem {
  id: string;
  created_at: string;
  scheduled_for: string;
  sent_at: string | null;
  recipient_email: string;
  subject: string;
  status: string;
  error_message: string | null;
}

const AdminEmailAutomation = () => {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [queueItems, setQueueItems] = useState<EmailQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sequencesRes, queueRes] = await Promise.all([
        supabase.from('email_sequences').select('*').order('created_at', { ascending: false }),
        supabase.from('email_queue').select('*').order('scheduled_for', { ascending: false }).limit(50)
      ]);

      if (sequencesRes.error) throw sequencesRes.error;
      if (queueRes.error) throw queueRes.error;

      setSequences(sequencesRes.data || []);
      setQueueItems(queueRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת הנתונים",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSequence = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('email_sequences')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "עודכן בהצלחה",
        description: !currentStatus ? "רצף האימיילים הופעל" : "רצף האימיילים הושבת",
      });

      fetchData();
    } catch (error) {
      console.error('Error toggling sequence:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בעדכון הרצף",
        variant: "destructive",
      });
    }
  };

  const deleteSequence = async (id: string) => {
    try {
      const { error } = await supabase
        .from('email_sequences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "נמחק בהצלחה",
        description: "הרצף נמחק",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting sequence:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת הרצף",
        variant: "destructive",
      });
    }
  };

  const pending = queueItems.filter(q => q.status === 'pending');
  const sent = queueItems.filter(q => q.status === 'sent');
  const failed = queueItems.filter(q => q.status === 'failed');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">אוטומציה של אימיילים</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ממתינים בתור</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{pending.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">נשלחו היום</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-500">{sent.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">נכשלו</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-destructive">{failed.length}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="sequences" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="sequences">רצפי אימיילים</TabsTrigger>
                <TabsTrigger value="queue">תור שליחה</TabsTrigger>
              </TabsList>

              <TabsContent value="sequences">
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : (
                  <div className="space-y-4">
                    {sequences.map((sequence) => (
                      <Card key={sequence.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>{sequence.name}</CardTitle>
                              {sequence.description && (
                                <CardDescription className="mt-2">
                                  {sequence.description}
                                </CardDescription>
                              )}
                            </div>
                            <Badge variant={sequence.is_active ? "default" : "secondary"}>
                              {sequence.is_active ? "פעיל" : "לא פעיל"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{sequence.trigger_type}</Badge>
                            <div className="flex gap-2 mr-auto">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleSequence(sequence.id, sequence.is_active)}
                              >
                                {sequence.is_active ? (
                                  <>
                                    <Pause className="h-4 w-4 ml-2" />
                                    השבת
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 ml-2" />
                                    הפעל
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteSequence(sequence.id)}
                              >
                                <Trash2 className="h-4 w-4 ml-2" />
                                מחק
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="queue">
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : (
                  <div className="space-y-4">
                    {queueItems.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-semibold mb-1">{item.subject}</div>
                              <div className="text-sm text-muted-foreground mb-2">
                                אל: {item.recipient_email}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                מתוזמן ל: {new Date(item.scheduled_for).toLocaleString('he-IL')}
                              </div>
                              {item.sent_at && (
                                <div className="text-xs text-green-600 mt-1">
                                  נשלח ב: {new Date(item.sent_at).toLocaleString('he-IL')}
                                </div>
                              )}
                              {item.error_message && (
                                <div className="text-xs text-destructive mt-1">
                                  שגיאה: {item.error_message}
                                </div>
                              )}
                            </div>
                            <Badge
                              variant={
                                item.status === 'sent'
                                  ? 'default'
                                  : item.status === 'failed'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {item.status === 'sent' && 'נשלח'}
                              {item.status === 'pending' && 'ממתין'}
                              {item.status === 'failed' && 'נכשל'}
                              {item.status === 'cancelled' && 'בוטל'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminEmailAutomation;
