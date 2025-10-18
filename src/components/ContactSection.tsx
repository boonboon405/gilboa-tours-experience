import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappNumber = '972537314235';
  const email = 'DavidIsraelTours@gmail.com';
  const phoneNumber = '053-7314235';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://wde.app.n8n.cloud/webhook/805437d0-da8b-4ec5-9a10-154900493358', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast.success('ההודעה נשלחה! נחזור אליך בקרוב.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('שגיאה בשליחת ההודעה. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            צור קשר
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
                    <p className="text-sm text-muted-foreground">טלפון</p>
                    <a
                      href={`tel:${phoneNumber}`}
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
                    <p className="text-sm text-muted-foreground">אימייל</p>
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
              asChild
            >
              <a href="https://wa.me/972537314235" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="ml-2 h-5 w-5" />
                וואטסאפ
              </a>
            </Button>
          </div>

          {/* Contact Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">צור קשר</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="שם מלא"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-2"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder='דוא"ל'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-2"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="טלפון"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="border-2"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="הודעה"
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
                  {isSubmitting ? 'שולח...' : 'שלח הודעה'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
