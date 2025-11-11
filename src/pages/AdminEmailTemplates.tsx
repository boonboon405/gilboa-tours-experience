import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  template_type: string;
  variables: any;
  is_active: boolean;
}

const AdminEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת התבניות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingTemplate({
      id: '',
      name: '',
      subject: '',
      html_content: '',
      template_type: 'custom',
      variables: [],
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const saveTemplate = async () => {
    if (!editingTemplate) return;

    try {
      if (editingTemplate.id) {
        const { error } = await supabase
          .from('email_templates')
          .update({
            name: editingTemplate.name,
            subject: editingTemplate.subject,
            html_content: editingTemplate.html_content,
            template_type: editingTemplate.template_type,
            is_active: editingTemplate.is_active,
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert([editingTemplate]);

        if (error) throw error;
      }

      toast({
        title: "נשמר בהצלחה",
        description: "התבנית נשמרה",
      });

      setIsDialogOpen(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת התבנית",
        variant: "destructive",
      });
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "נמחק בהצלחה",
        description: "התבנית נמחקה",
      });

      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת התבנית",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">תבניות אימייל</h1>
              <Button onClick={openNewDialog}>
                <Plus className="h-4 w-4 ml-2" />
                תבנית חדשה
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">טוען...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="mb-2">{template.name}</CardTitle>
                          <CardDescription>{template.subject}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={template.is_active ? "default" : "secondary"}>
                            {template.is_active ? "פעיל" : "לא פעיל"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">סוג: {template.template_type}</p>
                        {template.variables && Array.isArray(template.variables) && template.variables.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.variables.map((variable: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {`{{${variable}}}`}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(template)}
                        >
                          <Edit className="h-4 w-4 ml-2" />
                          ערוך
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4 ml-2" />
                          מחק
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate?.id ? 'ערוך תבנית' : 'תבנית חדשה'}</DialogTitle>
            <DialogDescription>
              השתמש במשתנים כמו {`{{customer_name}}`} בתוכן האימייל
            </DialogDescription>
          </DialogHeader>

          {editingTemplate && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>שם התבנית</Label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                  placeholder="שם התבנית"
                />
              </div>

              <div className="space-y-2">
                <Label>נושא</Label>
                <Input
                  value={editingTemplate.subject}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, subject: e.target.value })
                  }
                  placeholder="נושא האימייל"
                />
              </div>

              <div className="space-y-2">
                <Label>סוג</Label>
                <Input
                  value={editingTemplate.template_type}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, template_type: e.target.value })
                  }
                  placeholder="סוג התבנית"
                />
              </div>

              <div className="space-y-2">
                <Label>תוכן HTML</Label>
                <Textarea
                  value={editingTemplate.html_content}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, html_content: e.target.value })
                  }
                  placeholder="<div>תוכן האימייל...</div>"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingTemplate.is_active}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, is_active: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="is_active">תבנית פעילה</Label>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 ml-2" />
                  ביטול
                </Button>
                <Button onClick={saveTemplate}>
                  <Save className="h-4 w-4 ml-2" />
                  שמור
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmailTemplates;
