import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, Send, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { openWhatsApp, whatsappTemplates, trackPhoneCall } from '@/utils/contactTracking';
import { useLanguage } from '@/contexts/LanguageContext';

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().min(6).max(20),
  message: z.string().trim().min(1).max(2000),
});

export const ContactSection = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappNumber = '972537314235';
  const email = 'DavidIsraelTours@gmail.com';
  const phoneNumber = '0537314235';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(isHe ? 'אנא מלאו את כל השדות כנדרש' : 'Please fill in all fields correctly');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('forward-webhook', {
        body: parsed.data,
      });

      if (error) throw error;

      toast.success(isHe ? 'ההודעה נשלחה! נחזור אליך בקרוב.' : 'Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(isHe ? 'שגיאה בשליחת ההודעה. אנא נסו שוב.' : 'Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading text-foreground mb-4">
            {isHe ? 'צור קשר' : 'Get in Touch'}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-2 hover:shadow-soft transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="p-3 rounded-lg bg-gradient-hero">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{isHe ? 'טלפון' : 'Phone'}</p>
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
                    <p className="text-sm text-muted-foreground">{isHe ? 'אימייל' : 'Email'}</p>
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
              {isHe ? 'שלחו הודעה בוואטסאפ' : 'Send a WhatsApp Message'}
            </Button>
          </div>

          {/* Contact Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">{isHe ? 'שלחו לנו הודעה' : 'Send Us a Message'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder={isHe ? 'שם מלא' : 'Full Name'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    maxLength={100}
                    className="border-2"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={isHe ? 'דוא"ל' : 'Email Address'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    maxLength={150}
                    className="border-2"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder={isHe ? 'טלפון' : 'Phone Number'}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    maxLength={20}
                    className="border-2"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder={isHe ? 'הודעה' : 'Your Message'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    maxLength={2000}
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
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      {isHe ? 'שולח...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="ml-2 h-5 w-5" />
                      {isHe ? 'שלח הודעה' : 'Send Message'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
