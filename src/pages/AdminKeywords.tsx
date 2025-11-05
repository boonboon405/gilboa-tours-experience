import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const keywordSchema = z.object({
  keyword: z.string().trim().min(1, 'מילת מפתח לא יכולה להיות ריקה').max(200, 'מילת מפתח חייבת להיות פחות מ-200 תווים'),
  category: z.string().optional(),
});

type Keyword = {
  id: string;
  keyword: string;
  category: string | null;
  created_at: string;
  is_active: boolean;
};

const categories = [
  { value: 'team-building', label: 'גיבוש צוות' },
  { value: 'employees', label: 'עובדים' },
  { value: 'vacation', label: 'נופש' },
  { value: 'experience', label: 'חוויה' },
  { value: 'outdoor', label: 'פעילות חוץ' },
  { value: 'tours', label: 'סיורים' },
  { value: 'nature', label: 'טבע' },
  { value: 'workshops', label: 'סדנאות' },
  { value: 'inspiration', label: 'השראה' },
  { value: 'learning', label: 'למידה' },
  { value: 'enrichment', label: 'העשרה' },
  { value: 'odt', label: 'ODT' },
  { value: 'attractions', label: 'אטרקציות' },
  { value: 'sports', label: 'ספורט' },
  { value: 'volunteering', label: 'התנדבות' },
  { value: 'location', label: 'מיקום' },
  { value: 'management', label: 'מנהלים' },
  { value: 'corporate', label: 'חברות' },
  { value: 'culinary', label: 'קולינריה' },
  { value: 'cultural', label: 'תרבות' },
  { value: 'adventure', label: 'הרפתקה' },
  { value: 'office', label: 'משרד' },
  { value: 'english', label: 'אנגלית' },
];

export default function AdminKeywords() {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_keywords')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKeywords(data || []);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      toast.error('שגיאה בטעינת מילות המפתח');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async () => {
    try {
      const validated = keywordSchema.parse({
        keyword: newKeyword,
        category: newCategory || undefined,
      });

      setAdding(true);

      const { error } = await supabase
        .from('seo_keywords')
        .insert({
          keyword: validated.keyword,
          category: newCategory || null,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('מילת מפתח זו כבר קיימת במערכת');
        } else {
          throw error;
        }
        return;
      }

      toast.success('מילת מפתח נוספה בהצלחה');
      setNewKeyword('');
      setNewCategory('');
      fetchKeywords();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Error adding keyword:', error);
        toast.error('שגיאה בהוספת מילת מפתח');
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteKeyword = async (id: string, keyword: string) => {
    if (!confirm(`האם למחוק את "${keyword}"?`)) return;

    try {
      const { error } = await supabase
        .from('seo_keywords')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('מילת מפתח נמחקה בהצלחה');
      fetchKeywords();
    } catch (error) {
      console.error('Error deleting keyword:', error);
      toast.error('שגיאה במחיקת מילת מפתח');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('seo_keywords')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(currentStatus ? 'מילת מפתח הושבתה' : 'מילת מפתח הופעלה');
      fetchKeywords();
    } catch (error) {
      console.error('Error toggling keyword:', error);
      toast.error('שגיאה בעדכון סטטוס');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Button>
          <h1 className="text-3xl font-bold">ניהול מילות מפתח SEO</h1>
        </div>

        {/* Add Keyword Form */}
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">הוספת מילת מפתח חדשה</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="keyword">מילת מפתח</Label>
              <Input
                id="keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="לדוגמה: יום כיף"
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
            </div>
            <div>
              <Label htmlFor="category">קטגוריה (אופציונלי)</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddKeyword} disabled={adding || !newKeyword.trim()} className="w-full">
                <Plus className="ml-2 h-4 w-4" />
                הוסף
              </Button>
            </div>
          </div>
        </div>

        {/* Keywords Table */}
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              מילות מפתח קיימות ({keywords.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>מילת מפתח</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead>תאריך יצירה</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead className="text-left">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((kw) => (
                  <TableRow key={kw.id}>
                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                    <TableCell>
                      {kw.category
                        ? categories.find((c) => c.value === kw.category)?.label || kw.category
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(kw.created_at).toLocaleDateString('he-IL')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={kw.is_active ? 'default' : 'secondary'}
                        size="sm"
                        onClick={() => handleToggleActive(kw.id, kw.is_active)}
                      >
                        {kw.is_active ? 'פעיל' : 'לא פעיל'}
                      </Button>
                    </TableCell>
                    <TableCell className="text-left">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteKeyword(kw.id, kw.keyword)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
