import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Plus, Pencil, Trash2, Star, MessageSquare, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_company: string | null;
  testimonial_text: string;
  rating: number;
  language: string;
  status: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  language: string;
  priority: number | null;
  is_active: boolean;
}

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  contact_status: string;
}

export default function AdminDashboard() {
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) navigate('/auth');
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading || !user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/" className="text-xl font-bold text-primary">Simcha Admin</Link>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/'); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="testimonials">
          <TabsList className="mb-8">
            <TabsTrigger value="testimonials" className="gap-2"><Star className="h-4 w-4" /> המלצות</TabsTrigger>
            <TabsTrigger value="faq" className="gap-2"><MessageSquare className="h-4 w-4" /> שאלות נפוצות</TabsTrigger>
            <TabsTrigger value="leads" className="gap-2"><Users className="h-4 w-4" /> לידים</TabsTrigger>
          </TabsList>

          <TabsContent value="testimonials"><TestimonialsAdmin /></TabsContent>
          <TabsContent value="faq"><FAQAdmin /></TabsContent>
          <TabsContent value="leads"><LeadsAdmin /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Testimonials Admin ─────────────────────────────────────────
function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ customer_name: '', customer_company: '', testimonial_text: '', rating: 5, language: 'he', status: 'approved' });

  const load = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ customer_name: '', customer_company: '', testimonial_text: '', rating: 5, language: 'he', status: 'approved' });
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ customer_name: t.customer_name, customer_company: t.customer_company || '', testimonial_text: t.testimonial_text, rating: t.rating, language: t.language, status: t.status });
    setDialogOpen(true);
  };

  const save = async () => {
    const payload = { ...form, customer_company: form.customer_company || null };
    if (editing) {
      await supabase.from('testimonials').update(payload).eq('id', editing.id);
      toast.success('עודכן');
    } else {
      await supabase.from('testimonials').insert(payload);
      toast.success('נוסף');
    }
    setDialogOpen(false);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    toast.success('נמחק');
    load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>המלצות</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4" /> הוסף</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>חברה</TableHead>
              <TableHead>שפה</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>דירוג</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.customer_name}</TableCell>
                <TableCell>{t.customer_company}</TableCell>
                <TableCell>{t.language === 'he' ? 'עברית' : 'English'}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>{t.rating}★</TableCell>
                <TableCell className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'ערוך המלצה' : 'הוסף המלצה'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="שם" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
            <Input placeholder="חברה (אופציונלי)" value={form.customer_company} onChange={(e) => setForm({ ...form, customer_company: e.target.value })} />
            <Textarea placeholder="תוכן ההמלצה" value={form.testimonial_text} onChange={(e) => setForm({ ...form, testimonial_text: e.target.value })} rows={3} />
            <div className="grid grid-cols-3 gap-4">
              <Select value={String(form.rating)} onValueChange={(v) => setForm({ ...form, rating: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[1,2,3,4,5].map((n) => <SelectItem key={n} value={String(n)}>{n}★</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="he">עברית</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">מאושר</SelectItem>
                  <SelectItem value="pending">ממתין</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={save} className="w-full">{editing ? 'עדכן' : 'הוסף'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ─── FAQ Admin ──────────────────────────────────────────────────
function FAQAdmin() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', language: 'he', priority: 0 });

  const load = async () => {
    const { data } = await supabase.from('knowledge_base').select('*').order('priority', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ question: '', answer: '', language: 'he', priority: 0 });
    setDialogOpen(true);
  };

  const openEdit = (f: FAQ) => {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, language: f.language, priority: f.priority || 0 });
    setDialogOpen(true);
  };

  const save = async () => {
    if (editing) {
      await supabase.from('knowledge_base').update(form).eq('id', editing.id);
      toast.success('עודכן');
    } else {
      await supabase.from('knowledge_base').insert({ ...form, is_active: true });
      toast.success('נוסף');
    }
    setDialogOpen(false);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('knowledge_base').delete().eq('id', id);
    toast.success('נמחק');
    load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>שאלות נפוצות</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4" /> הוסף</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שאלה</TableHead>
              <TableHead>שפה</TableHead>
              <TableHead>עדיפות</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium max-w-xs truncate">{f.question}</TableCell>
                <TableCell>{f.language === 'he' ? 'עברית' : 'English'}</TableCell>
                <TableCell>{f.priority}</TableCell>
                <TableCell className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'ערוך שאלה' : 'הוסף שאלה'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="שאלה" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            <Textarea placeholder="תשובה" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="he">עברית</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="עדיפות" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
            </div>
            <Button onClick={save} className="w-full">{editing ? 'עדכן' : 'הוסף'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ─── Leads Admin ────────────────────────────────────────────────
function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(50);
      if (data) setLeads(data);
    };
    load();
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>לידים</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>טלפון</TableHead>
              <TableHead>הודעה</TableHead>
              <TableHead>תאריך</TableHead>
              <TableHead>סטטוס</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell>{l.phone}</TableCell>
                <TableCell className="max-w-xs truncate">{l.notes}</TableCell>
                <TableCell>{new Date(l.created_at).toLocaleDateString('he-IL')}</TableCell>
                <TableCell>{l.contact_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
