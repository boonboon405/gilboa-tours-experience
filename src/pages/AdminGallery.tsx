import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Upload, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryImage {
  id: string;
  category: string;
  title: string;
  description: string | null;
  alt_text: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const categories = [
  { value: 'gilboa', label: 'נופי הגלבוע והגליל' },
  { value: 'springs', label: 'עמק המעיינות' },
  { value: 'activities', label: 'פעילויות וחוויות' }
];

const AdminGallery = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState({
    category: 'gilboa',
    title: '',
    description: '',
    alt_text: '',
    file: null as File | null
  });

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery-images-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('category')
        .order('display_order');
      
      if (error) throw error;
      return data as GalleryImage[];
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!newImage.file) throw new Error('נא לבחור קובץ');
      if (!newImage.title) throw new Error('נא להזין כותרת');
      if (!newImage.alt_text) throw new Error('נא להזין טקסט חלופי');

      setUploading(true);

      // Upload file to storage
      const fileExt = newImage.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, newImage.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      // Insert into database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          category: newImage.category,
          title: newImage.title,
          description: newImage.description || null,
          alt_text: newImage.alt_text,
          image_url: urlData.publicUrl
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast.success('התמונה הועלתה בהצלחה');
      setNewImage({ category: 'gilboa', title: '', description: '', alt_text: '', file: null });
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (image: GalleryImage) => {
      // Extract filename from URL
      const fileName = image.image_url.split('/').pop();
      
      if (fileName) {
        await supabase.storage.from('gallery-images').remove([fileName]);
      }
      
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', image.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('התמונה נמחקה בהצלחה');
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    },
    onError: () => {
      toast.error('שגיאה במחיקת התמונה');
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    }
  });

  const groupedImages = images?.reduce((acc, img) => {
    if (!acc[img.category]) acc[img.category] = [];
    acc[img.category].push(img);
    return acc;
  }, {} as Record<string, GalleryImage[]>);

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">ניהול גלריית תמונות</h1>
        </div>

        {/* Upload Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              העלאת תמונה חדשה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>קטגוריה</Label>
                <Select 
                  value={newImage.category} 
                  onValueChange={(value) => setNewImage(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>כותרת *</Label>
                <Input
                  value={newImage.title}
                  onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="הזן כותרת לתמונה"
                />
              </div>

              <div className="space-y-2">
                <Label>תיאור</Label>
                <Input
                  value={newImage.description}
                  onChange={(e) => setNewImage(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="הזן תיאור קצר"
                />
              </div>

              <div className="space-y-2">
                <Label>טקסט חלופי (Alt) *</Label>
                <Input
                  value={newImage.alt_text}
                  onChange={(e) => setNewImage(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="תיאור לנגישות"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>קובץ תמונה *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                />
              </div>

              <div className="md:col-span-2">
                <Button 
                  onClick={() => uploadMutation.mutate()} 
                  disabled={uploading || !newImage.file}
                  className="w-full md:w-auto"
                >
                  {uploading ? 'מעלה...' : 'העלה תמונה'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images List */}
        {isLoading ? (
          <div className="text-center py-8">טוען...</div>
        ) : (
          <div className="space-y-8">
            {categories.map(cat => (
              <Card key={cat.value}>
                <CardHeader>
                  <CardTitle>{cat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {!groupedImages?.[cat.value]?.length ? (
                    <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                      <ImageIcon className="h-12 w-12 opacity-50" />
                      <p>אין תמונות בקטגוריה זו</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {groupedImages[cat.value].map(image => (
                        <div key={image.id} className="relative group border rounded-lg overflow-hidden">
                          <img 
                            src={image.image_url} 
                            alt={image.alt_text}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-3 bg-card">
                            <h4 className="font-medium truncate">{image.title}</h4>
                            {image.description && (
                              <p className="text-sm text-muted-foreground truncate">{image.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={image.is_active}
                                  onCheckedChange={(checked) => 
                                    toggleActiveMutation.mutate({ id: image.id, is_active: checked })
                                  }
                                />
                                <span className="text-sm">{image.is_active ? 'פעיל' : 'מוסתר'}</span>
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                  if (confirm('האם למחוק את התמונה?')) {
                                    deleteMutation.mutate(image);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
