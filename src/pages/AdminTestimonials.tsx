import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Star, Check, X, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_company: string | null;
  rating: number;
  testimonial_text: string;
  tour_type: string | null;
  status: string;
  created_at: string;
  is_featured: boolean;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת ההמלצות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "עודכן בהצלחה",
        description: `ההמלצה ${status === 'approved' ? 'אושרה' : 'נדחתה'}`,
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בעדכון ההמלצה",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured: !currentValue })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "עודכן בהצלחה",
        description: !currentValue ? "ההמלצה מודגשת כעת" : "ההמלצה אינה מודגשת",
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "נמחק בהצלחה",
        description: "ההמלצה נמחקה",
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת ההמלצה",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const renderTestimonialCard = (testimonial: Testimonial) => (
    <Card key={testimonial.id} className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{testimonial.customer_name}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < testimonial.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            {testimonial.customer_company && (
              <p className="text-sm text-muted-foreground">{testimonial.customer_company}</p>
            )}
            {testimonial.tour_type && (
              <Badge variant="outline" className="mt-2">{testimonial.tour_type}</Badge>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Badge
              variant={
                testimonial.status === 'approved'
                  ? 'default'
                  : testimonial.status === 'rejected'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {testimonial.status === 'approved' && 'מאושר'}
              {testimonial.status === 'rejected' && 'נדחה'}
              {testimonial.status === 'pending' && 'ממתין'}
            </Badge>
            {testimonial.is_featured && (
              <Badge variant="outline" className="bg-yellow-50">⭐ מודגש</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap mb-4">
          {testimonial.testimonial_text}
        </p>
        <div className="flex gap-2 flex-wrap">
          {testimonial.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => updateStatus(testimonial.id, 'approved')}
              >
                <Check className="h-4 w-4 ml-2" />
                אשר
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateStatus(testimonial.id, 'rejected')}
              >
                <X className="h-4 w-4 ml-2" />
                דחה
              </Button>
            </>
          )}
          {testimonial.status === 'approved' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
            >
              <Eye className="h-4 w-4 ml-2" />
              {testimonial.is_featured ? 'בטל הדגשה' : 'הדגש'}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteId(testimonial.id)}
          >
            <Trash2 className="h-4 w-4 ml-2" />
            מחק
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const pending = testimonials.filter(t => t.status === 'pending');
  const approved = testimonials.filter(t => t.status === 'approved');
  const rejected = testimonials.filter(t => t.status === 'rejected');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">ניהול המלצות</h1>

            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  ממתין ({pending.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  מאושר ({approved.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  נדחה ({rejected.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : pending.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      אין המלצות ממתינות לאישור
                    </CardContent>
                  </Card>
                ) : (
                  pending.map(renderTestimonialCard)
                )}
              </TabsContent>

              <TabsContent value="approved">
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : approved.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      אין המלצות מאושרות
                    </CardContent>
                  </Card>
                ) : (
                  approved.map(renderTestimonialCard)
                )}
              </TabsContent>

              <TabsContent value="rejected">
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : rejected.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      אין המלצות נדחות
                    </CardContent>
                  </Card>
                ) : (
                  rejected.map(renderTestimonialCard)
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את ההמלצה לצמיתות ולא ניתן לשחזר אותה.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteTestimonial(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTestimonials;
