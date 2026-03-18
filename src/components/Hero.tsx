import { useState, useEffect, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

import springsNature from '@/assets/springs-nature.jpg';
import springsClubcarsCombined from '@/assets/springs-clubcars-combined.jpg';
import galileeNature from '@/assets/galilee-nature.jpg';
import odtTeam from '@/assets/odt-team.jpg';
import beitSheanPanorama from '@/assets/beit-shean-panorama.jpg';

const heroSlides = [
  { src: beitSheanPanorama, alt: 'Beit Shean Valley panoramic landscape' },
  { src: springsNature, alt: 'Springs Valley natural landscape' },
  { src: springsClubcarsCombined, alt: 'Springs Valley guided activity and VIP club car experience' },
  { src: galileeNature, alt: 'Galilee nature and greenery' },
  { src: odtTeam, alt: 'Team building day experience' },
];

export const Hero = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Rotating background images */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <img
            src={heroSlides[currentIndex].src}
            alt={heroSlides[currentIndex].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/70 mb-4 font-medium">
            {t('hero.tag')}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            {t('hero.title.1')}<br />{t('hero.title.2')}
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed">
            {t('hero.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/972537314235?text=Hi%20Simcha%2C%20I'd%20like%20more%20info" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-base px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <MessageCircle className="h-5 w-5" />
                {t('hero.whatsapp')}
              </Button>
            </a>
            <Link to="/booking">
              <Button variant="outline" size="lg" className="text-base px-8 border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary">
                {t('hero.book')}
              </Button>
            </Link>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-primary-foreground w-6' : 'bg-primary-foreground/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
