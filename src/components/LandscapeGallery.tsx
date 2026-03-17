import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Mountain, Sparkles, Search } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import galileeNature from '@/assets/galilee-nature.jpg';
import springsNature from '@/assets/springs-nature.jpg';
import heroGilboa from '@/assets/hero-gilboa.jpg';
import clubCars from '@/assets/club-cars.jpg';
import culinary from '@/assets/culinary-experience.jpg';
import beitShean from '@/assets/beit-shean.jpg';
import beitSheanPanorama from '@/assets/beit-shean-panorama.jpg';
import pelicans from '@/assets/pelicans.jpg';
import springsActivity from '@/assets/springs-activity.jpg';
import odtTeam from '@/assets/odt-team.jpg';

interface GallerySection {
  id: string;
  title: string;
  description: string;
  images: { src: string; alt: string; title: string; description: string }[];
}

interface DynamicImage {
  id: string;
  category: string;
  title: string;
  description: string | null;
  alt_text: string;
  image_url: string;
}

const getStaticSections = (lang: string): GallerySection[] => [
  {
    id: 'galilee',
    title: lang === 'he' ? 'הגליל והכנרת' : 'Galilee & Sea of Galilee',
    description: lang === 'he' ? 'נופים עוצרי נשימה של אזור הגליל והכנרת' : 'Breathtaking landscapes of the Galilee and Sea of Galilee region',
    images: [
      { src: galileeNature, alt: lang === 'he' ? 'נוף ירוק של הרי הגליל' : 'Green landscape of the Galilee mountains', title: lang === 'he' ? 'נופי הגליל' : 'Galilee Views', description: lang === 'he' ? 'נוף פנורמי של הרי הגליל' : 'Panoramic view of the Galilee mountains' },
      { src: pelicans, alt: lang === 'he' ? 'להקת שקנאים בנדידה' : 'Migrating pelicans flock', title: lang === 'he' ? 'נדידת ציפורים' : 'Bird Migration', description: lang === 'he' ? 'חיות בר באגמון החולה' : 'Wildlife at Hula Valley' },
      { src: beitShean, alt: lang === 'he' ? 'שרידי העיר הרומית בבית שאן' : 'Roman city ruins at Beit She\'an', title: lang === 'he' ? 'עמק בית שאן' : 'Beit She\'an Valley', description: lang === 'he' ? 'נוף היסטורי מרהיב' : 'Stunning historical landscape' },
      { src: beitSheanPanorama, alt: lang === 'he' ? 'פנורמה של התיאטרון הרומי' : 'Roman theater panorama', title: lang === 'he' ? 'התיאטרון הרומי' : 'Roman Theater', description: lang === 'he' ? 'מבט פנורמי על העתיקות' : 'Panoramic view of the ruins' },
      { src: springsNature, alt: lang === 'he' ? 'מעיינות הגליל' : 'Galilee springs', title: lang === 'he' ? 'מעיינות הגליל' : 'Galilee Springs', description: lang === 'he' ? 'מעיינות טבעיים באזור' : 'Natural springs in the region' },
      { src: culinary, alt: lang === 'he' ? 'טעמי הגליל' : 'Galilee flavors', title: lang === 'he' ? 'טעמי הגליל' : 'Galilee Flavors', description: lang === 'he' ? 'חוויות קולינריות באזור' : 'Culinary experiences in the region' },
    ]
  },
  {
    id: 'gilboa',
    title: lang === 'he' ? 'הרי הגלבוע' : 'Gilboa Mountains',
    description: lang === 'he' ? 'הפנינה הטבעית של צפון הארץ' : 'The natural gem of Northern Israel',
    images: [
      { src: heroGilboa, alt: lang === 'he' ? 'תצפית מפסגת הגלבוע' : 'View from Gilboa summit', title: lang === 'he' ? 'הרי הגלבוע' : 'Gilboa Mountains', description: lang === 'he' ? 'שקיעה מדהימה מפסגות הגלבוע' : 'Stunning sunset from Gilboa peaks' },
      { src: springsNature, alt: lang === 'he' ? 'מעיינות בגן השלושה' : 'Springs at Gan HaShlosha', title: lang === 'he' ? 'עמק המעיינות' : 'Springs Valley', description: lang === 'he' ? 'מעיינות צלולים בלב הטבע' : 'Crystal-clear springs in nature' },
      { src: springsActivity, alt: lang === 'he' ? 'פעילויות במעיינות' : 'Activities at the springs', title: lang === 'he' ? 'פעילויות במעיינות' : 'Spring Activities', description: lang === 'he' ? 'חוויות ייחודיות במים' : 'Unique water experiences' },
      { src: beitShean, alt: lang === 'he' ? 'נוף עמק בית שאן' : 'Beit She\'an valley view', title: lang === 'he' ? 'תצפית העמק' : 'Valley Viewpoint', description: lang === 'he' ? 'מבט לעמק מהפסגה' : 'View from the summit' },
      { src: clubCars, alt: lang === 'he' ? 'טיול רכבי שטח בגלבוע' : 'Off-road tour in the Gilboa', title: lang === 'he' ? 'טיולי שטח' : 'Off-Road Tours', description: lang === 'he' ? 'הרפתקאות בגלבוע' : 'Adventures in the Gilboa' },
    ]
  },
  {
    id: 'activities',
    title: lang === 'he' ? 'פעילויות וחוויות' : 'Activities & Experiences',
    description: lang === 'he' ? 'מגוון פעילויות מרתקות בטבע' : 'A variety of exciting outdoor activities',
    images: [
      { src: clubCars, alt: lang === 'he' ? 'רכבי שטח חשמליים' : 'Electric off-road vehicles', title: lang === 'he' ? 'רכבי שטח חשמליים' : 'Electric Off-Road Vehicles', description: lang === 'he' ? 'טיולים מאתגרים בשטח' : 'Challenging off-road tours' },
      { src: culinary, alt: lang === 'he' ? 'חוויות קולינריות' : 'Culinary experiences', title: lang === 'he' ? 'חוויות קולינריות' : 'Culinary Experiences', description: lang === 'he' ? 'טעמים אותנטיים של האזור' : 'Authentic regional flavors' },
      { src: odtTeam, alt: lang === 'he' ? 'גיבוש ODT' : 'ODT team building', title: lang === 'he' ? 'גיבוש ODT' : 'ODT Team Building', description: lang === 'he' ? 'פעילויות גיבוש צוותיות' : 'Team building activities' },
      { src: springsActivity, alt: lang === 'he' ? 'פעילויות מים' : 'Water activities', title: lang === 'he' ? 'פעילויות מים' : 'Water Activities', description: lang === 'he' ? 'הרפתקאות במים' : 'Water adventures' },
      { src: galileeNature, alt: lang === 'he' ? 'טיולי טבע' : 'Nature hikes', title: lang === 'he' ? 'טיולי טבע' : 'Nature Hikes', description: lang === 'he' ? 'סיורים מודרכים בטבע' : 'Guided nature tours' },
    ]
  }
];

export const LandscapeGallery = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [activeSection, setActiveSection] = useState<string>('galilee');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: dynamicImages } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data as DynamicImage[];
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY * 0.3}px`);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const gallerySections = useMemo(() => {
    const staticSections = getStaticSections(language);
    return staticSections.map(section => {
      const dbCategory = section.id === 'galilee' ? 'gilboa' : section.id === 'gilboa' ? 'springs' : 'activities';
      const dynamicForSection = (dynamicImages || [])
        .filter(img => img.category === dbCategory)
        .map(img => ({ src: img.image_url, alt: img.alt_text, title: img.title, description: img.description || '' }));
      return { ...section, images: [...section.images, ...dynamicForSection] };
    });
  }, [dynamicImages, language]);

  const currentSection = gallerySections.find(s => s.id === activeSection) || gallerySections[0];

  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return currentSection.images;
    const query = searchQuery.toLowerCase();
    return currentSection.images.filter(img =>
      img.title.toLowerCase().includes(query) || img.description.toLowerCase().includes(query) || img.alt.toLowerCase().includes(query)
    );
  }, [currentSection.images, searchQuery]);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-accent/5 to-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse transition-transform duration-1000 ease-out" style={{ transform: 'translateY(var(--scroll-y, 0))' }} />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-pulse [animation-delay:2s] transition-transform duration-1000 ease-out" style={{ transform: 'translateY(calc(var(--scroll-y, 0) * -0.5))' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Mountain className="h-5 w-5" />
            <span className="font-medium">{isEn ? 'Landscape Gallery' : 'גלריית נופים'}</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-primary via-foreground to-primary bg-clip-text text-transparent">
            {isEn ? 'Our Stunning Landscapes' : 'הנופים המדהימים שלנו'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {isEn ? 'Discover the natural beauty of the Gilboa, Galilee, and the valleys' : 'גלו את היופי הטבעי של אזור הגלבוע, הגליל והעמקים'}
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isEn ? 'Search images by name or description...' : 'חפש תמונות לפי שם או תיאור...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-card/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {gallerySections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-500 relative overflow-hidden group ${
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground shadow-[0_8px_30px_hsl(var(--primary)/0.3)] scale-105'
                  : 'bg-card hover:bg-accent border border-border hover:border-primary/50 hover:shadow-lg hover:scale-105'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {activeSection !== section.id && (
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
              <span className="relative z-10">{section.title}</span>
            </button>
          ))}
        </div>

        <Card key={activeSection} className="backdrop-blur-sm bg-card/50 border-2 border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
          <CardHeader className="text-center animate-in slide-in-from-top-4 fade-in duration-500">
            <CardTitle className="text-3xl font-bold">{currentSection.title}</CardTitle>
            <CardDescription className="text-lg">{currentSection.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredImages.length > 0 ? (
              <ImageGallery images={filteredImages} layout="grid" />
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg text-muted-foreground">{isEn ? 'No images match your search' : 'לא נמצאו תמונות התואמות לחיפוש'}</p>
                <p className="text-sm text-muted-foreground/70 mt-2">{isEn ? 'Try different search terms' : 'נסה מילות חיפוש אחרות'}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { number: '100+', label: isEn ? 'Stunning Views' : 'נופים מדהימים', icon: Mountain },
            { number: '50+', label: isEn ? 'Unique Locations' : 'מיקומים ייחודיים', icon: Sparkles },
            { number: '10+', label: isEn ? 'Nature Zones' : 'אזורי טבע', icon: Mountain },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center backdrop-blur-sm bg-card/30 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.2)] hover:scale-105 group">
                <CardContent className="pt-6">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
