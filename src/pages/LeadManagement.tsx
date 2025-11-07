import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, MessageSquare, Mail, Phone, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  source_platform: string;
  engagement_type: string;
  contact_status: string;
  interested_keywords: string[] | null;
  notes: string | null;
  last_contacted_at: string | null;
};

type MessageDialog = {
  open: boolean;
  lead: Lead | null;
  type: 'email' | 'whatsapp';
};

export default function LeadManagement() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [engagementFilter, setEngagementFilter] = useState('all');
  const [messageDialog, setMessageDialog] = useState<MessageDialog>({
    open: false,
    lead: null,
    type: 'email',
  });
  const [messageContent, setMessageContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery, statusFilter, sourceFilter, engagementFilter]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('שגיאה בטעינת הלידים');
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    if (searchQuery) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone?.includes(searchQuery)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.contact_status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.source_platform === sourceFilter);
    }

    if (engagementFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.engagement_type === engagementFilter);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId: string, newStatus: 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted' | 'follow_up') => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          contact_status: newStatus,
          last_contacted_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;
      toast.success('סטטוס עודכן בהצלחה');
      fetchLeads();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('שגיאה בעדכון הסטטוס');
    }
  };

  const openMessageDialog = (lead: Lead, type: 'email' | 'whatsapp') => {
    setMessageDialog({ open: true, lead, type });
    setMessageContent('');
  };

  const closeMessageDialog = () => {
    setMessageDialog({ open: false, lead: null, type: 'email' });
    setMessageContent('');
  };

  const sendMessage = async () => {
    if (!messageDialog.lead || !messageContent) {
      toast.error('נא למלא את תוכן ההודעה');
      return;
    }

    setSending(true);
    try {
      if (messageDialog.type === 'email') {
        const { error } = await supabase.functions.invoke('send-contact-email', {
          body: {
            to: messageDialog.lead.email,
            subject: 'הודעה מצוות Gilboa Tours',
            message: messageContent,
          },
        });

        if (error) throw error;
      } else {
        // WhatsApp messaging
        const { error } = await supabase.functions.invoke('send-preferences-email', {
          body: {
            phone: messageDialog.lead.phone,
            message: messageContent,
          },
        });

        if (error) throw error;
      }

      // Log the message
      await supabase.from('message_logs').insert({
        lead_id: messageDialog.lead.id,
        message_type: messageDialog.type,
        recipient: messageDialog.type === 'email' ? messageDialog.lead.email : messageDialog.lead.phone,
        message_content: messageContent,
        status: 'sent',
      });

      // Update lead status
      await updateLeadStatus(messageDialog.lead.id, 'contacted');

      toast.success('ההודעה נשלחה בהצלחה');
      closeMessageDialog();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('שגיאה בשליחת ההודעה');
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      new: 'default',
      contacted: 'secondary',
      interested: 'outline',
      not_interested: 'destructive',
      converted: 'outline',
      follow_up: 'secondary',
    };

    const labels: Record<string, string> = {
      new: 'חדש',
      contacted: 'נוצר קשר',
      interested: 'מעוניין',
      not_interested: 'לא מעוניין',
      converted: 'הומר',
      follow_up: 'מעקב',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען לידים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Button>
          <h1 className="text-4xl font-bold mb-2">ניהול לידים</h1>
          <p className="text-muted-foreground">סה"כ {leads.length} לידים</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">סינון וחיפוש</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי שם, אימייל או טלפון..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="new">חדש</SelectItem>
                <SelectItem value="contacted">נוצר קשר</SelectItem>
                <SelectItem value="interested">מעוניין</SelectItem>
                <SelectItem value="not_interested">לא מעוניין</SelectItem>
                <SelectItem value="converted">הומר</SelectItem>
                <SelectItem value="follow_up">מעקב</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="מקור" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל המקורות</SelectItem>
                <SelectItem value="website">אתר</SelectItem>
                <SelectItem value="facebook">פייסבוק</SelectItem>
                <SelectItem value="instagram">אינסטגרם</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="referral">הפניה</SelectItem>
                <SelectItem value="other">אחר</SelectItem>
              </SelectContent>
            </Select>
            <Select value={engagementFilter} onValueChange={setEngagementFilter}>
              <SelectTrigger>
                <SelectValue placeholder="סוג עיסוק" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסוגים</SelectItem>
                <SelectItem value="inquiry">פנייה</SelectItem>
                <SelectItem value="booking">הזמנה</SelectItem>
                <SelectItem value="quote_request">בקשה להצעת מחיר</SelectItem>
                <SelectItem value="follow_up">מעקב</SelectItem>
                <SelectItem value="other">אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Leads Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>אימייל</TableHead>
                  <TableHead>טלפון</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>מקור</TableHead>
                  <TableHead>תאריך יצירה</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      לא נמצאו לידים
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email || '-'}</TableCell>
                      <TableCell>{lead.phone || '-'}</TableCell>
                      <TableCell>
                        <Select
                          value={lead.contact_status}
                          onValueChange={(value) => updateLeadStatus(lead.id, value as 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted' | 'follow_up')}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>{getStatusBadge(lead.contact_status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">חדש</SelectItem>
                            <SelectItem value="contacted">נוצר קשר</SelectItem>
                            <SelectItem value="interested">מעוניין</SelectItem>
                            <SelectItem value="not_interested">לא מעוניין</SelectItem>
                            <SelectItem value="converted">הומר</SelectItem>
                            <SelectItem value="follow_up">מעקב</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{lead.source_platform}</TableCell>
                      <TableCell>
                        {new Date(lead.created_at).toLocaleDateString('he-IL')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {lead.email && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openMessageDialog(lead, 'email')}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          {lead.phone && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openMessageDialog(lead, 'whatsapp')}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Message Dialog */}
        <Dialog open={messageDialog.open} onOpenChange={closeMessageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {messageDialog.type === 'email' ? 'שלח אימייל' : 'שלח הודעת WhatsApp'}
              </DialogTitle>
              <DialogDescription>
                שלח הודעה ל-{messageDialog.lead?.name}
                {messageDialog.type === 'email' 
                  ? ` (${messageDialog.lead?.email})`
                  : ` (${messageDialog.lead?.phone})`
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="message">תוכן ההודעה</Label>
                <Textarea
                  id="message"
                  placeholder="כתוב את ההודעה שלך כאן..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeMessageDialog}>
                ביטול
              </Button>
              <Button onClick={sendMessage} disabled={sending}>
                {sending ? 'שולח...' : 'שלח'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
