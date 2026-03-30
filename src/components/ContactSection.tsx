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

      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitted(true);
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

          {/* Contact Form or Confirmation */}
          <Card className="border-2">
            {submitted ? (
              <CardContent className="p-8 text-center space-y-5 animate-fade-in">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {isHe ? 'ההודעה נשלחה בהצלחה!' : 'Message Sent Successfully!'}
                </h3>
                <p className="text-muted-foreground leading-[1.7]">
                  {isHe
                    ? 'תודה שפניתם אלינו! נחזור אליכם תוך 24 שעות. לתגובה מהירה יותר, שלחו לנו הודעה בוואטסאפ.'
                    : 'Thank you for reaching out! We\'ll get back to you within 24 hours. For a faster response, send us a WhatsApp message.'}
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    variant="whatsapp"
                    size="lg"
                    className="w-full"
                    onClick={() => window.open('https://wa.me/972537314235', '_blank')}
                  >
                    <MessageCircle className="ml-2 h-5 w-5" />
                    {isHe ? 'שלחו הודעה בוואטסאפ' : 'Chat on WhatsApp'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setSubmitted(false)}
                  >
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    {isHe ? 'שליחת הודעה נוספת' : 'Send Another Message'}
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
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
              </>
            )}
          </Card>
        </div>

        {/* Google Maps Embed */}
        <div className="mt-12 max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-4 text-center">
            {isHe ? 'מיקום' : 'Our Location'}
          </h3>
          <div className="rounded-xl overflow-hidden border-2 border-border shadow-soft">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108889.7530498498!2d35.35!3d32.48!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151c6f48b0e96d4d%3A0x9b7c8b5e0dc8e0e4!2sGilboa!5e0!3m2!1sen!2sil!4v1700000000000!5m2!1sen!2sil"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={isHe ? 'מפת אזור הגלבוע ועמק המעיינות' : 'Map of Gilboa & Springs Valley area'}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
