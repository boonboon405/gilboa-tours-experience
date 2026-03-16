import { useState, useEffect, useRef } from 'react';
import { Phone, MessageCircle, Sparkles, Calendar, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-gilboa.jpg';
import springsNature from '@/assets/springs-nature.jpg';
import galileeNature from '@/assets/galilee-nature.jpg';
import belvoirFortress from '@/assets/belvoir-fortress.jpg';
import nahalAyun from '@/assets/nahal-ayun-waterfall.jpg';
import beitShean from '@/assets/beit-shean-panorama.jpg';
import { LandscapeImageSelector } from './LandscapeImageSelector';
import { openWhatsApp, whatsappTemplates, trackPhoneCall } from '@/utils/contactTracking';
import { getClickableProps } from '@/hooks/use-keyboard-nav';
import { useLanguage } from '@/contexts/LanguageContext';

const curatedImages = [heroImage, springsNature, galileeNature, belvoirFortress, nahalAyun, beitShean];

export const Hero = () => {
  const { t } = useLanguage();
  const [images, setImages] = useState<string[]>(curatedImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const whatsappNumber = '972537314235';
  const phoneNumber = '0537314235';

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  return (
    <section ref={heroRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          filter: `blur(${Math.min(scrollY / 100, 8)}px)`,
          transition: 'transform 0.1s ease-out, filter 0.3s ease-out'
        }}
      >
        {images.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={`נוף פנורמי מרהיב של הרי הגלבוע ועמק המעיינות בצפון ישראל - תמונה ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/70" />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="absolute top-20 right-4 z-20 bg-background/80 backdrop-blur-sm animate-fade-in [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards] hover:scale-105 transition-all hover:shadow-lg animate-[float_8s_ease-in-out_infinite]"
        onClick={() => setShowImageSelector(true)}
      >
        <Sparkles className="ml-2 h-4 w-4 animate-[spin_12s_linear_infinite]" />
        {t('hero.generateAI')}
      </Button>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-[zoom-fade-in_0.8s_ease-out] hero-glow">
            {t('hero.title')}
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold text-accent mb-6 animate-[zoom-fade-in_0.8s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards] hero-glow-accent">
            {t('hero.subtitle')}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
          <p className="text-base md:text-lg text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('hero.categories')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/chat">
              <Button
                variant="hero"
                size="lg"
                className="text-lg px-8 py-6 gap-2 animate-[slow-pulse_30s_ease-in-out_infinite] transition-all hover:scale-105 hover:shadow-xl ripple-effect animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]"
              >
                <Bot className="h-5 w-5" />
                {t('hero.chatAgent')}
              </Button>
            </Link>
            <Link to="/booking">
              <Button
                variant="hero"
                size="lg"
                className="text-lg px-8 py-6 gap-2 transition-all hover:scale-105 hover:shadow-xl ripple-effect animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]"
              >
                <Calendar className="h-5 w-5" />
                {t('hero.bookTour')}
              </Button>
            </Link>
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-6 transition-all hover:scale-105 hover:shadow-xl ripple-effect animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Phone className="h-5 w-5" />
              {t('hero.contactUs')}
            </Button>
          </div>

          <div className="flex justify-center mb-8">
            <Button
              variant="whatsapp"
              size="lg"
              className="text-lg px-8 py-6 transition-all hover:scale-105 hover:shadow-xl ripple-effect animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]"
              onClick={() => openWhatsApp('972537314235', whatsappTemplates.general, 'hero')}
            >
              <MessageCircle className="ml-2 h-5 w-5" />
              {t('hero.whatsapp')}
            </Button>
          </div>

          <a
            href={`tel:${phoneNumber}`}
            onClick={() => trackPhoneCall(phoneNumber, 'hero')}
            className="inline-flex items-center text-white text-xl font-semibold hover:text-accent transition-all duration-300 animate-fade-in [animation-delay:1s] opacity-0 [animation-fill-mode:forwards] hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group"
          >
            <Phone className="ml-2 h-6 w-6 group-hover:animate-[ring_1s_ease-in-out]" />
            {phoneNumber}
          </a>
        </div>
      </div>

      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce animate-fade-in [animation-delay:1.2s] opacity-0 [animation-fill-mode:forwards]"
        {...getClickableProps(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }))}
        aria-label={t('hero.scrollDown')}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center cursor-pointer hover:border-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-[scroll-indicator_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <LandscapeImageSelector
        open={showImageSelector}
        onOpenChange={setShowImageSelector}
        onImagesSelected={(newImages) => {
          setImages(newImages);
          setCurrentImageIndex(0);
        }}
      />
    </section>
  );
};
