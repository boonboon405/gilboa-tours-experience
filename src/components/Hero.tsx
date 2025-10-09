import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-gilboa.jpg';
import { LandscapeImageSelector } from './LandscapeImageSelector';

export const Hero = () => {
  const [images, setImages] = useState<string[]>([heroImage]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const whatsappNumber = '972523456789';
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
        setCurrentImageIndex((prev) => {
          const newIndex = (prev + 1) % images.length;
          console.log('🔄 Rotating image:', { from: prev, to: newIndex, totalImages: images.length });
          return newIndex;
        });
      }, 10000);

      return () => {
        console.log('🛑 Clearing image rotation interval');
        clearInterval(interval);
      };
    } else {
      console.log('⚠️ Not enough images for rotation:', images.length);
    }
  }, [images]);

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
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              הזמינו את ההרפתקה
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
