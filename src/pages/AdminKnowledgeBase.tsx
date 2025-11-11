import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Book, 
  Search,
  Tag,
  TrendingUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  is_active: boolean;
  priority: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export default function AdminKnowledgeBase() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    keywords: '',
    priority: 50,
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לטעון את מאגר הידע",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const entryData = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
        priority: formData.priority,
        is_active: true
      };

      if (editingEntry) {
        const { error } = await supabase
          .from('knowledge_base')
          .update(entryData)
          .eq('id', editingEntry.id);

        if (error) throw error;
        
        toast({
          title: "עודכן בהצלחה",
          description: "הערך עודכן במאגר הידע"
        });
      } else {
        const { error } = await supabase
          .from('knowledge_base')
          .insert(entryData);

        if (error) throw error;
        
        toast({
          title: "נוסף בהצלחה",
          description: "ערך חדש נוסף למאגר הידע"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לשמור את הערך",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק ערך זה?')) return;

    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "נמחק בהצלחה",
        description: "הערך נמחק ממאגר הידע"
      });

      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו למחוק את הערך",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (entry: KnowledgeEntry) => {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .update({ is_active: !entry.is_active })
        .eq('id', entry.id);

      if (error) throw error;

      toast({
        title: entry.is_active ? "הוסתר" : "הופעל",
        description: entry.is_active ? "הערך הוסתר מהסוכן החכם" : "הערך הופעל בסוכן החכם"
      });

      fetchEntries();
    } catch (error) {
      console.error('Error toggling active:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לעדכן את הסטטוס",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (entry: KnowledgeEntry) => {
    setEditingEntry(entry);
    setFormData({
      question: entry.question,
      answer: entry.answer,
      category: entry.category || '',
      keywords: entry.keywords.join(', '),
      priority: entry.priority
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingEntry(null);
    setFormData({
      question: '',
      answer: '',
      category: '',
      keywords: '',
      priority: 50
    });
  };

  const filteredEntries = entries.filter(entry =>
    entry.question.includes(searchTerm) ||
    entry.answer.includes(searchTerm) ||
    entry.category?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Book className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">מאגר ידע - Q&A</h1>
                <p className="text-muted-foreground">נהל את השאלות והתשובות של הסוכן החכם</p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  הוסף ערך חדש
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingEntry ? 'ערוך ערך' : 'הוסף ערך חדש'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="question">שאלה</Label>
                    <Input
                      id="question"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      placeholder="מה השאלה?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="answer">תשובה</Label>
                    <Textarea
                      id="answer"
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      placeholder="מה התשובה?"
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">קטגוריה</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="לדוגמה: כללי, מחירים, מיקום"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="keywords">מילות מפתח (מופרדות בפסיקים)</Label>
                    <Input
                      id="keywords"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="מה, מציעים, פעילויות"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">עדיפות (0-100)</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1 gap-2">
                      <Save className="w-4 h-4" />
                      {editingEntry ? 'עדכן' : 'הוסף'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      ביטול
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חפש שאלות, תשובות או קטגוריות..."
                className="pr-10"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Book className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">סך הכל ערכים</p>
                    <p className="text-2xl font-bold">{entries.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Tag className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">ערכים פעילים</p>
                    <p className="text-2xl font-bold">
                      {entries.filter(e => e.is_active).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">קטגוריות</p>
                    <p className="text-2xl font-bold">
                      {new Set(entries.map(e => e.category).filter(Boolean)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Entries List */}
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  טוען...
                </CardContent>
              </Card>
            ) : filteredEntries.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  לא נמצאו ערכים
                </CardContent>
              </Card>
            ) : (
              filteredEntries.map((entry) => (
                <Card key={entry.id} className={!entry.is_active ? 'opacity-50' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{entry.question}</CardTitle>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {entry.answer}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(entry)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2">
                      {entry.category && (
                        <Badge variant="outline">{entry.category}</Badge>
                      )}
                      {entry.keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      <Badge 
                        variant={entry.is_active ? "default" : "destructive"}
                        className="cursor-pointer"
                        onClick={() => handleToggleActive(entry)}
                      >
                        {entry.is_active ? 'פעיל' : 'מושבת'}
                      </Badge>
                      <Badge variant="outline">עדיפות: {entry.priority}</Badge>
                      {entry.usage_count > 0 && (
                        <Badge variant="outline">שימושים: {entry.usage_count}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}