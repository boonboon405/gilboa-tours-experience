import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-gilboa.jpg';

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="נוף פנורמי של הרי הגלבוע"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/70 mb-4 font-medium">
            חוויות קבוצתיות בצפון ישראל
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            יום מושלם.<br />זיכרונות לכל החיים.
          </h1>

          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed">
            סיורים מודרכים, ימי גיבוש, וחוויות VIP באזור הגלבוע, עמק המעיינות והגליל.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/972537314235?text=היי%20שמחה%2C%20אשמח%20לפרטים%20נוספים"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="text-base px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <MessageCircle className="h-5 w-5" />
                דברו איתנו בוואטסאפ
              </Button>
            </a>
            <Link to="/booking">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                הזמינו סיור
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
