import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { he: 'גלה את הגליל', en: 'Discover the Galilee', sub: 'Guided tours through Israel\'s most breathtaking landscapes', img: '/images/hero/sea-of-galilee.jpg' },
  { he: 'ימי גיבוש בטבע', en: 'Team Building in Nature', sub: 'Unforgettable group experiences on Mount Gilboa', img: '/images/hero/mount-gilboa.jpg' },
  { he: 'מעיינות עמק הבזלת', en: 'Springs Valley', sub: 'Hidden gem tours through ancient water springs', img: '/images/hero/springs-waterfall.jpg' },
  { he: 'חוויות VIP', en: 'VIP Experiences', sub: 'Premium private tours tailored to you', img: '/images/hero/jezreel-valley.jpg' },
  { he: 'עמק יזרעאל', en: 'Jezreel Valley', sub: 'Biblical landscapes, modern luxury', img: '/images/hero/upper-galilee.jpg' },
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[800ms] ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background image */}
          <img src={slide.img} alt={slide.en} className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
          {/* Gradient overlay – bottom 60% */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" style={{ top: '40%' }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="font-['Heebo'] text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
              {slide.he}
            </h1>
            <p className="font-['Heebo'] text-2xl md:text-4xl text-white mb-3">
              {slide.en}
            </p>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8">
              {slide.sub}
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full px-8 py-3 bg-accent text-white font-semibold text-lg hover:brightness-110 transition-all"
            >
              Book Your Tour
            </a>
          </div>
        </div>
      ))}

      {/* Desktop arrows */}
      <button
        onClick={() => goTo(currentSlide - 1)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" style={{ color: 'var(--gold-nav)' }} />
      </button>
      <button
        onClick={() => goTo(currentSlide + 1)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" style={{ color: 'var(--gold-nav)' }} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
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
