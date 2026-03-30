import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const slides = [
  { he: 'גלה את הגליל', en: 'Discover the Galilee', subHe: 'סיורים מודרכים בנופים עוצרי הנשימה של ישראל', subEn: 'Guided tours through Israel\'s most breathtaking landscapes', img: 'https://images.unsplash.com/photo-1739820644476-6adf21e31830?w=1920&q=80&fit=crop' },
  { he: 'ימי גיבוש בטבע', en: 'Team Building in Nature', subHe: 'חוויות קבוצתיות בלתי נשכחות בהר הגלבוע', subEn: 'Unforgettable group experiences on Mount Gilboa', img: 'https://images.unsplash.com/photo-1608637765750-6b77adacfcac?w=1920&q=80&fit=crop' },
  { he: 'מעיינות עמק הבזלת', en: 'Springs Valley', subHe: 'סיורים במעיינות העתיקים הנסתרים', subEn: 'Hidden gem tours through ancient water springs', img: 'https://images.unsplash.com/photo-1660924375739-75e64670bd40?w=1920&q=80&fit=crop' },
  { he: 'חוויות VIP', en: 'VIP Experiences', subHe: 'טיולים פרטיים ומותאמים אישית', subEn: 'Premium private tours tailored to you', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80&fit=crop' },
  { he: 'עמק יזרעאל', en: 'Jezreel Valley', subHe: 'נופים מקראיים, מותרות מודרניות', subEn: 'Biblical landscapes, modern luxury', img: 'https://images.unsplash.com/photo-1697747245806-6aa4b6565a54?w=1920&q=80&fit=crop' },
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { language } = useLanguage();
  const isHe = language === 'he';

  const goTo = useCallback((index: number) => {
    setCurrentSlide((index + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [isPaused]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[800ms] ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={slide.img} alt={isHe ? slide.he : slide.en} className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" style={{ top: '40%' }} />

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="font-['Heebo'] font-bold text-white mb-2" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>
              {isHe ? slide.he : slide.en}
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8">
              {isHe ? slide.subHe : slide.subEn}
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full px-8 py-3 bg-accent text-white font-semibold text-lg hover:brightness-110 transition-all"
            >
              {isHe ? 'הזמינו סיור' : 'Book Your Tour'}
            </a>
          </div>
        </div>
      ))}

      <button
        onClick={() => goTo(currentSlide - 1)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        aria-label={isHe ? 'שקופית קודמת' : 'Previous slide'}
      >
        <ChevronLeft className="w-6 h-6" style={{ color: 'var(--gold-nav)' }} />
      </button>
      <button
        onClick={() => goTo(currentSlide + 1)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        aria-label={isHe ? 'שקופית הבאה' : 'Next slide'}
      >
        <ChevronRight className="w-6 h-6" style={{ color: 'var(--gold-nav)' }} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={isHe ? `עבור לשקופית ${i + 1}` : `Go to slide ${i + 1}`}
            className="w-3 h-3 rounded-full border-2 transition-all"
            style={{
              borderColor: 'var(--gold-nav)',
              backgroundColor: i === currentSlide ? 'var(--gold-nav)' : 'transparent',
            }}
          />
        ))}
      </div>
    </section>
  );
};
