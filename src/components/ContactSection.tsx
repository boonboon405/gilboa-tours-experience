import { useState } from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(6).max(30),
  message: z.string().trim().max(1000),
});

export const ContactSection = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: parsed.data.name,
        phone: parsed.data.phone,
        notes: parsed.data.message || null,
        source_platform: 'website' as const,
        engagement_type: 'form_submission' as const,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast.error(t('contact.error') || 'Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('contact.title')}</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{t('contact.desc')}</p>
            <div className="space-y-4">
              <a href="tel:0537314235" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                <Phone className="h-5 w-5 text-primary" />
                <span>053-731-4235</span>
              </a>
              <a href="mailto:info@simcha-tours.co.il" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@simcha-tours.co.il</span>
              </a>
            </div>
            <div className="mt-8">
              <a href="https://wa.me/972537314235" target="_blank" rel="noopener noreferrer">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <MessageCircle className="h-5 w-5" />
                  {t('contact.whatsapp')}
                </Button>
              </a>
            </div>
          </div>
          <div>
            {submitted ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-foreground font-semibold mb-2">{t('contact.thanks.title')}</p>
                <p className="text-muted-foreground text-sm">{t('contact.thanks.desc')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder={t('contact.form.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input placeholder={t('contact.form.phone')} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                <Textarea placeholder={t('contact.form.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? '...' : t('contact.form.submit')}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
