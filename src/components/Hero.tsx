import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Sparkles, Calendar, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-gilboa.jpg';
import { LandscapeImageSelector } from './LandscapeImageSelector';

const STORAGE_KEY = 'landscape-images';

export const Hero = () => {
  const [images, setImages] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedImages = saved ? JSON.parse(saved) : [];
    // Filter out empty/undefined slots
    const validImages = savedImages.filter((img: string) => img);
    return validImages.length > 0 ? validImages : [heroImage];
  });

  // Persist images to localStorage whenever they change
  useEffect(() => {
    if (images.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      console.log('💾 Saved images to localStorage:', images.length);
    }
  }, [images]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const whatsappNumber = '972537314235';
  const phoneNumber = '053-7314235';

  // Auto-rotate images every 10 seconds
  useEffect(() => {
    console.log('🖼️ Hero Images:', {
      totalImages: images.length,
      currentIndex: currentImageIndex,
      images: images
    });
    
    if (images.length > 1) {
      console.log('✅ Starting image rotation interval');
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          console.log('🔄 Rotating image:', { from: prevIndex, to: nextIndex, totalImages: images.length });
          return nextIndex;
        });
      }, 10000);

      return () => {
        console.log('🛑 Clearing image rotation interval');
        clearInterval(interval);
      };
    } else {
      console.log('⚠️ Not enough images for rotation:', images.length);
    }
  }, [images.length]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Images with Fade Transition */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={`הרי הגלבוע ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/70" />
      </div>

      {/* AI Image Generator Button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-20 right-4 z-20 bg-background/80 backdrop-blur-sm"
        onClick={() => setShowImageSelector(true)}
      >
        <Sparkles className="ml-2 h-4 w-4" />
        צור תמונת רקע ב-AI
      </Button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-fade-in">
            חוויה קבוצתית מיוחדת, בונה ובלתי נשכחת
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold text-accent mb-6 animate-fade-in">
            בלב הגלבוע הגליל וסובב כנרת
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            יום חווייתי, מהנה ומשמעותי שמשלב היסטוריה, טבע, גיבוש והרבה זיכרונות טובים לחברה שלכם.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/chat">
              <Button
                variant="hero"
                size="lg"
                className="text-lg px-8 py-6 gap-2 animate-pulse"
              >
                <Bot className="h-5 w-5" />
                שוחח עם הסוכן החכם
              </Button>
            </Link>
            <Link to="/booking">
              <Button
                variant="hero"
                size="lg"
                className="text-lg px-8 py-6 gap-2"
              >
                <Calendar className="h-5 w-5" />
                הזמן סיור
              </Button>
            </Link>
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              צור קשר
            </Button>
            <Button
              variant="whatsapp"
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
            >
              <MessageCircle className="ml-2 h-5 w-5" />
              וואטסאפ
            </Button>
          </div>

          {/* Phone Number */}
          <a
            href={`tel:${phoneNumber}`}
            className="inline-flex items-center text-white text-xl font-semibold hover:text-accent transition-colors"
          >
            <Phone className="ml-2 h-6 w-6" />
            {phoneNumber}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>

      {/* Image Selector Dialog */}
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
