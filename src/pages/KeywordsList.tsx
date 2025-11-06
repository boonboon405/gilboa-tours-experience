import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Download, FileSpreadsheet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

type Keyword = {
  id: string;
  keyword: string;
  category: string | null;
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

export default function KeywordsList() {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchKeywords();
  }, []);

  useEffect(() => {
    filterKeywords();
  }, [searchTerm, selectedCategory, keywords]);

  const fetchKeywords = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_keywords')
        .select('id, keyword, category')
        .eq('is_active', true)
        .order('keyword');

      if (error) throw error;
      setKeywords(data || []);
      setFilteredKeywords(data || []);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterKeywords = () => {
    let filtered = keywords;

    if (searchTerm) {
      filtered = filtered.filter(kw => 
        kw.keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(kw => kw.category === selectedCategory);
    }

    setFilteredKeywords(filtered);
  };

  const getCategoryLabel = (value: string | null) => {
    if (!value) return null;
    return categories.find(c => c.value === value)?.label || value;
  };

  const exportToCSV = () => {
    const csvContent = [
      ['מילת מפתח', 'קטגוריה'],
      ...filteredKeywords.map(kw => [
        kw.keyword,
        getCategoryLabel(kw.category) || 'ללא קטגוריה'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `keywords_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('הקובץ הורד בהצלחה');
  };

  const exportToExcel = () => {
    const data = filteredKeywords.map(kw => ({
      'מילת מפתח': kw.keyword,
      'קטגוריה': getCategoryLabel(kw.category) || 'ללא קטגוריה'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Keywords');
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 30 },
      { wch: 20 }
    ];

    XLSX.writeFile(workbook, `keywords_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('הקובץ הורד בהצלחה');
  };

  const groupedKeywords = filteredKeywords.reduce((acc, kw) => {
    const cat = kw.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(kw);
    return acc;
  }, {} as Record<string, Keyword[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">רשימת מילות מפתח</h1>
              <p className="text-muted-foreground">סה"כ {keywords.length} מילות מפתח</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline">
                <Download className="ml-2 h-4 w-4" />
                ייצא CSV
              </Button>
              <Button onClick={exportToExcel} variant="outline">
                <FileSpreadsheet className="ml-2 h-4 w-4" />
                ייצא Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש מילות מפתח..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background"
          >
            <option value="all">כל הקטגוריות</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Keywords Display */}
        {selectedCategory === 'all' ? (
          <div className="grid gap-8">
            {Object.entries(groupedKeywords).map(([category, keywordsList]) => (
              <Card key={category} className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">
                  {getCategoryLabel(category === 'uncategorized' ? null : category) || 'ללא קטגוריה'} 
                  <span className="text-sm text-muted-foreground mr-2">
                    ({keywordsList.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {keywordsList.map((kw) => (
                    <div
                      key={kw.id}
                      className="px-4 py-2 bg-secondary/50 rounded-lg text-sm hover:bg-secondary transition-colors"
                    >
                      {kw.keyword}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {getCategoryLabel(selectedCategory)}
              <span className="text-sm text-muted-foreground mr-2">
                ({filteredKeywords.length})
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredKeywords.map((kw) => (
                <div
                  key={kw.id}
                  className="px-4 py-2 bg-secondary/50 rounded-lg text-sm hover:bg-secondary transition-colors"
                >
                  {kw.keyword}
                </div>
              ))}
            </div>
          </Card>
        )}

        {filteredKeywords.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            לא נמצאו מילות מפתח
          </div>
        )}
      </div>
    </div>
  );
}
