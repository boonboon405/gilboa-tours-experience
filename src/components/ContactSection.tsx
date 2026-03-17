import { useState } from 'react';
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
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  message: z.string().trim().min(1).max(1000),
});

export const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phoneNumber = '0537314235';
  const email = 'DavidIsraelTours@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || 'Validation error');
      setIsSubmitting(false);
      return;
    }
    try {
      const { error } = await supabase.functions.invoke('forward-webhook', { body: parsed.data });
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
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('contact.title')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info side */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('contact.phoneLabel')}</p>
                <a
                  href={`tel:${phoneNumber}`}
                  onClick={() => trackPhoneCall(phoneNumber, 'contact-section')}
                  className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {phoneNumber}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('contact.emailLabel')}</p>
                <a href={`mailto:${email}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  {email}
                </a>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
              onClick={() => openWhatsApp('972537314235', whatsappTemplates.inquiry, 'contact-section')}
            >
              <MessageCircle className="h-5 w-5" />
              {t('contact.whatsapp')}
            </Button>
          </div>

          {/* Form side */}
          <form onSubmit={handleSubmit} className="space-y-4 p-8 rounded-2xl border border-border bg-card">
            <Input
              placeholder={t('contact.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder={t('contact.email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              type="tel"
              placeholder={t('contact.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Textarea
              placeholder={t('contact.message')}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={4}
            />
            <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
              <Send className="h-4 w-4" />
              {isSubmitting ? t('contact.sending') : t('contact.send')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
