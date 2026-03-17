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
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(language === 'he' ? 'אנא מלאו את כל השדות' : 'Please fill all fields');
      setIsSubmitting(false);
      return;
    }
    try {
      await supabase.functions.invoke('forward-webhook', { body: parsed.data });
      toast.success(language === 'he' ? 'ההודעה נשלחה בהצלחה!' : 'Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error(language === 'he' ? 'שגיאה בשליחה. נסו שוב.' : 'Error sending. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {language === 'he' ? 'צור קשר' : 'Get in Touch'}
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              {language === 'he'
                ? 'נשמח לעזור לכם לתכנן את היום המושלם. פנו אלינו בכל דרך שנוחה לכם.'
                : 'We\'d love to help you plan the perfect day. Reach out in any way that\'s convenient.'}
            </p>

            <div className="space-y-6">
              <a href="tel:0537314235" onClick={() => trackPhoneCall('0537314235', 'contact')} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{language === 'he' ? 'טלפון' : 'Phone'}</p>
                  <p className="font-semibold">0537314235</p>
                </div>
              </a>
              <a href="mailto:DavidIsraelTours@gmail.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{language === 'he' ? 'אימייל' : 'Email'}</p>
                  <p className="font-semibold">DavidIsraelTours@gmail.com</p>
                </div>
              </a>
              <button
                onClick={() => openWhatsApp('972537314235', whatsappTemplates.inquiry, 'contact')}
                className="flex items-center gap-4 group w-full text-start"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <MessageCircle className="h-5 w-5 text-[#25D366] group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <p className="font-semibold">{language === 'he' ? 'שלחו הודעה' : 'Send a message'}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 rounded-2xl border border-border bg-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder={language === 'he' ? 'שם מלא' : 'Full Name'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder={language === 'he' ? 'דוא"ל' : 'Email'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                type="tel"
                placeholder={language === 'he' ? 'טלפון' : 'Phone'}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Textarea
                placeholder={language === 'he' ? 'ספרו לנו על האירוע שלכם...' : 'Tell us about your event...'}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
              />
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                {isSubmitting
                  ? (language === 'he' ? 'שולח...' : 'Sending...')
                  : (language === 'he' ? 'שלח הודעה' : 'Send Message')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
