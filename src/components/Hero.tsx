import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-gilboa.jpg';
import { openWhatsApp, whatsappTemplates } from '@/utils/contactTracking';
import { useLanguage } from '@/contexts/LanguageContext';

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <motion.img
        src={heroImage}
        alt={t('hero.title')}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.h2
            className="text-2xl md:text-4xl font-semibold text-accent mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('hero.subtitle')}
          </motion.h2>
          <motion.p
            className="text-lg text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/booking">
              <Button
                size="lg"
                className="text-lg px-8 py-6 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
              >
                <Calendar className="h-5 w-5" />
                {t('hero.bookTour')}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 gap-2 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all"
              onClick={() => openWhatsApp('972537314235', whatsappTemplates.general, 'hero')}
            >
              <MessageCircle className="h-5 w-5" />
              {t('hero.whatsapp')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 gap-2 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Phone className="h-5 w-5" />
              {t('hero.contactUs')}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
