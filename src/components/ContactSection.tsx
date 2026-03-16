import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { openWhatsApp, whatsappTemplates, trackPhoneCall } from '@/utils/contactTracking';
import { useLanguage } from '@/contexts/LanguageContext';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'שם נדרש').max(100, 'שם ארוך מדי'),
  email: z.string().trim().email('אימייל לא תקין').max(255, 'אימייל ארוך מדי'),
  phone: z.string().trim().min(6, 'טלפון לא תקין').max(30, 'טלפון ארוך מדי'),
  message: z.string().trim().min(1, 'הודעה נדרשת').max(1000, 'הודעה ארוכה מדי'),
});

export const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappNumber = '972537314235';
  const email = 'DavidIsraelTours@gmail.com';
  const phoneNumber = '0537314235';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || 'בדיקת קלט נכשלה');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('forward-webhook', {
        body: parsed.data,
      });

      if (error) throw error;

      toast.success(t('contact.success'));
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('contact.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('contact.title')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <Card className="border-2 hover:shadow-soft transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="p-3 rounded-lg bg-gradient-hero">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contact.phoneLabel')}</p>
                    <a
                      href={`tel:${phoneNumber}`}
                      onClick={() => trackPhoneCall(phoneNumber, 'contact-section')}
                      className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {phoneNumber}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-soft transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="p-3 rounded-lg bg-gradient-water">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contact.emailLabel')}</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="whatsapp"
              size="lg"
              className="w-full text-lg"
              onClick={() => openWhatsApp('972537314235', whatsappTemplates.inquiry, 'contact-section')}
            >
              <MessageCircle className="ml-2 h-5 w-5" />
              {t('contact.whatsapp')}
            </Button>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">{t('contact.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder={t('contact.name')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-2"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={t('contact.email')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-2"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder={t('contact.phone')}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="border-2"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder={t('contact.message')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="border-2"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full text-lg"
                  disabled={isSubmitting}
                >
                  <Send className="ml-2 h-5 w-5" />
                  {isSubmitting ? t('contact.sending') : t('contact.send')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
