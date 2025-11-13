import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Plus, Trash2, BarChart3, TrendingUp, Tag, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Category {
  id: string;
  category_key: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  recommendations: string[];
  is_active: boolean;
  display_order: number;
}

interface CategoryStats {
  category: string;
  appearance_count: number;
  avg_percentage: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState('');
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      // Convert Json to string[] for recommendations
      const formattedData = (data || []).map(cat => ({
        ...cat,
        recommendations: Array.isArray(cat.recommendations) 
          ? cat.recommendations.filter((r): r is string => typeof r === 'string')
          : []
      }));
      setCategories(formattedData);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_category_stats');

      if (error) throw error;
      setStats(data || []);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSave = async () => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editingCategory.name,
          icon: editingCategory.icon,
          description: editingCategory.description,
          color: editingCategory.color,
          recommendations: editingCategory.recommendations,
          is_active: editingCategory.is_active,
          display_order: editingCategory.display_order
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      toast({
        title: 'נשמר בהצלחה',
        description: 'הקטגוריה עודכנה'
      });

      setIsDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: error.message
      });
    }
  };

  const generateDescription = async () => {
    if (!editingCategory) return;
    
    setGeneratingDescription(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-category-description', {
        body: {
          categoryName: editingCategory.name,
          categoryKey: editingCategory.category_key,
          currentDescription: editingCategory.description
        }
      });

      if (error) throw error;

      if (data?.description) {
        setEditingCategory({
          ...editingCategory,
          description: data.description
        });
        toast({
          title: 'תיאור נוצר בהצלחה',
          description: 'התיאור עודכן על ידי AI'
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: error.message || 'שגיאה ביצירת תיאור'
      });
    } finally {
      setGeneratingDescription(false);
    }
  };

  const addRecommendation = () => {
    if (!editingCategory || !newRecommendation.trim()) return;

    setEditingCategory({
      ...editingCategory,
      recommendations: [...editingCategory.recommendations, newRecommendation.trim()]
    });
    setNewRecommendation('');
  };

  const removeRecommendation = (index: number) => {
    if (!editingCategory) return;

    const updated = [...editingCategory.recommendations];
    updated.splice(index, 1);
    setEditingCategory({
      ...editingCategory,
      recommendations: updated
    });
  };

  const getCategoryIcon = (icon: string) => {
    return <span className="text-2xl">{icon}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">ניהול קטגוריות</h1>
              <p className="text-muted-foreground">
                ערוך פרטי קטגוריות והמלצות + צפה בסטטיסטיקות
              </p>
            </div>

            <Tabs defaultValue="categories" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="categories">
                  <Tag className="w-4 h-4 ml-2" />
                  קטגוריות
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="w-4 h-4 ml-2" />
                  אנליטיקס
                </TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">טוען...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <Card key={category.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {getCategoryIcon(category.icon)}
                              <div>
                                <CardTitle className="text-xl">{category.name}</CardTitle>
                                <Badge variant={category.is_active ? 'default' : 'secondary'} className="mt-1">
                                  {category.is_active ? 'פעיל' : 'לא פעיל'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <CardDescription className="mt-2">
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">המלצות ({category.recommendations.length})</Label>
                            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                              {category.recommendations.slice(0, 3).map((rec, idx) => (
                                <div key={idx} className="text-sm text-muted-foreground truncate">
                                  • {rec}
                                </div>
                              ))}
                              {category.recommendations.length > 3 && (
                                <div className="text-sm text-muted-foreground">
                                  +{category.recommendations.length - 3} נוספות...
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => {
                              setEditingCategory(category);
                              setIsDialogOpen(true);
                            }}
                            className="w-full"
                          >
                            <Pencil className="w-4 h-4 ml-2" />
                            ערוך קטגוריה
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      סטטיסטיקות בחירות קטגוריות (30 יום אחרונים)
                    </CardTitle>
                    <CardDescription>
                      מבוסס על תוצאות Quiz שהושלמו
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        אין עדיין נתונים להצגה
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {stats.map((stat, idx) => {
                          const category = categories.find(c => c.category_key === stat.category);
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {category && getCategoryIcon(category.icon)}
                                  <div>
                                    <p className="font-medium">{category?.name || stat.category}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {stat.appearance_count} בחירות
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-lg font-bold">
                                  {stat.avg_percentage}%
                                </Badge>
                              </div>
                              <Progress value={Number(stat.avg_percentage)} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>תובנות מרכזיות</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stats.length > 0 && (
                      <>
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">הקטגוריה המובילה</p>
                          <p className="text-2xl font-bold text-primary">
                            {categories.find(c => c.category_key === stats[0]?.category)?.name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {stats[0]?.appearance_count} בחירות במהלך 30 יום
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">ממוצע אחוזים</p>
                            <p className="text-xl font-bold">
                              {(stats.reduce((sum, s) => sum + Number(s.avg_percentage), 0) / stats.length).toFixed(1)}%
                            </p>
                          </div>
                          
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">סה"כ בחירות</p>
                            <p className="text-xl font-bold">
                              {stats.reduce((sum, s) => sum + s.appearance_count, 0)}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ערוך קטגוריה</DialogTitle>
            <DialogDescription>
              ערוך פרטי קטגוריה והמלצות
            </DialogDescription>
          </DialogHeader>

          {editingCategory && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>שם הקטגוריה</Label>
                  <Input
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>אייקון (אימוג'י)</Label>
                  <Input
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>תיאור</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
                    disabled={generatingDescription}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {generatingDescription ? 'מייצר...' : 'צור עם AI'}
                  </Button>
                </div>
                <Textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>צבעי גרדיאנט (Tailwind classes)</Label>
                <Input
                  value={editingCategory.color}
                  onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  placeholder="from-red-500 to-orange-500"
                />
                <div className={`h-12 rounded-lg bg-gradient-to-r ${editingCategory.color}`} />
              </div>

              <div className="space-y-2">
                <Label>סדר תצוגה</Label>
                <Input
                  type="number"
                  value={editingCategory.display_order.toString()}
                  onChange={(e) => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-3">
                <Label>המלצות ({editingCategory.recommendations.length})</Label>
                <div className="space-y-2">
                  {editingCategory.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="flex-1 text-sm">{rec}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecommendation(idx)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newRecommendation}
                    onChange={(e) => setNewRecommendation(e.target.value)}
                    placeholder="הוסף המלצה חדשה..."
                    onKeyPress={(e) => e.key === 'Enter' && addRecommendation()}
                  />
                  <Button onClick={addRecommendation}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  שמור שינויים
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingCategory(null);
                  }}
                >
                  ביטול
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
