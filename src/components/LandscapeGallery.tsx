import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Mountain, Sparkles, Search } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

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

const getStaticSections = (isHe: boolean): GallerySection[] => [
  {
    id: 'galilee',
    title: isHe ? 'הגליל והכנרת' : 'The Galilee & Sea of Galilee',
    description: isHe ? 'נופים עוצרי נשימה של אזור הגליל והכנרת' : 'Breathtaking landscapes of the Galilee and Sea of Galilee region',
    images: [
      { src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80&fit=crop', alt: isHe ? 'נוף ירוק ופורח של הרי הגליל' : 'Lush green landscape of the Galilee mountains', title: isHe ? 'נופי הגליל' : 'Galilee Views', description: isHe ? 'נוף פנורמי של הרי הגליל' : 'Panoramic view of the Galilee mountains' },
      { src: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800&q=80&fit=crop', alt: isHe ? 'להקת שקנאים בנדידה מעל אגמון החולה' : 'Pelican flock migrating over the Hula Valley', title: isHe ? 'נדידת ציפורים' : 'Bird Migration', description: isHe ? 'חיות בר באגמון החולה' : 'Wildlife at the Hula Valley' },
      { src: 'https://images.unsplash.com/photo-1580835832666-75a8f4f54ec3?w=800&q=80&fit=crop', alt: isHe ? 'שרידי העיר הרומית סקיתופוליס בבית שאן' : 'Ruins of the Roman city Scythopolis in Beit She\'an', title: isHe ? 'עמק בית שאן' : 'Beit She\'an Valley', description: isHe ? 'נוף היסטורי מרהיב' : 'Stunning historical landscape' },
      { src: 'https://images.unsplash.com/photo-1580835832666-75a8f4f54ec3?w=800&q=80&fit=crop', alt: isHe ? 'פנורמה של התיאטרון הרומי העתיק בבית שאן' : 'Panorama of the ancient Roman theater in Beit She\'an', title: isHe ? 'התיאטרון הרומי' : 'The Roman Theater', description: isHe ? 'מבט פנורמי על העתיקות' : 'Panoramic view of the antiquities' },
      { src: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800&q=80&fit=crop', alt: isHe ? 'מעיינות הכנרת והגליל' : 'Springs of the Galilee', title: isHe ? 'מעיינות הגליל' : 'Galilee Springs', description: isHe ? 'מעיינות טבעיים באזור' : 'Natural springs in the region' },
      { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop', alt: isHe ? 'טעמי הגליל - יין ומטעמים מקומיים' : 'Flavors of the Galilee - local wine and delicacies', title: isHe ? 'טעמי הגליל' : 'Flavors of the Galilee', description: isHe ? 'חוויות קולינריות באזור' : 'Culinary experiences in the region' },
    ]
  },
  {
    id: 'gilboa',
    title: isHe ? 'הרי הגלבוע' : 'Mount Gilboa',
    description: isHe ? 'הפנינה הטבעית של צפון הארץ' : 'The natural gem of northern Israel',
    images: [
      { src: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf5?w=800&q=80&fit=crop', alt: isHe ? 'תצפית מפסגת הרי הגלבוע' : 'View from the summit of Mount Gilboa', title: isHe ? 'הרי הגלבוע' : 'Mount Gilboa', description: isHe ? 'שקיעה מדהימה מפסגות הגלבוע' : 'Stunning sunset from the Gilboa peaks' },
      { src: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800&q=80&fit=crop', alt: isHe ? 'מעיינות בגן השלושה' : 'Springs at Gan HaShlosha', title: isHe ? 'עמק המעיינות' : 'Springs Valley', description: isHe ? 'מעיינות צלולים בלב הטבע' : 'Crystal-clear springs in nature' },
      { src: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800&q=80&fit=crop', alt: isHe ? 'פעילות מים במעיינות' : 'Water activities at the springs', title: isHe ? 'פעילויות במעיינות' : 'Spring Activities', description: isHe ? 'חוויות ייחודיות במים' : 'Unique water experiences' },
      { src: 'https://images.unsplash.com/photo-1580835832666-75a8f4f54ec3?w=800&q=80&fit=crop', alt: isHe ? 'נוף עמק בית שאן מהגלבוע' : 'Beit She\'an Valley view from Gilboa', title: isHe ? 'תצפית העמק' : 'Valley Lookout', description: isHe ? 'מבט לעמק מהפסגה' : 'View of the valley from the summit' },
      { src: 'https://images.unsplash.com/photo-1533591380348-14193f1de18f?w=800&q=80&fit=crop', alt: isHe ? 'טיול רכבי שטח בגלבוע' : 'Off-road vehicle tour on Gilboa', title: isHe ? 'טיולי שטח' : 'Off-Road Tours', description: isHe ? 'הרפתקאות בגלבוע' : 'Adventures on Gilboa' },
    ]
  },
  {
    id: 'activities',
    title: isHe ? 'פעילויות וחוויות' : 'Activities & Experiences',
    description: isHe ? 'מגוון פעילויות מרתקות בטבע' : 'A variety of exciting activities in nature',
    images: [
      { src: 'https://images.unsplash.com/photo-1533591380348-14193f1de18f?w=800&q=80&fit=crop', alt: isHe ? 'רכבי שטח חשמליים בגלבוע' : 'Electric off-road vehicles on Gilboa', title: isHe ? 'רכבי שטח חשמליים' : 'Electric Off-Road Vehicles', description: isHe ? 'טיולים מאתגרים בשטח' : 'Challenging off-road tours' },
      { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop', alt: isHe ? 'מטעמים מקומיים' : 'Local delicacies', title: isHe ? 'חוויות קולינריות' : 'Culinary Experiences', description: isHe ? 'טעמים אותנטיים של האזור' : 'Authentic flavors of the region' },
      { src: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=800&q=80&fit=crop', alt: isHe ? 'פעילות גיבוש ODT' : 'ODT team building activity', title: isHe ? 'גיבוש ODT' : 'ODT Team Building', description: isHe ? 'פעילויות גיבוש צוותיות' : 'Team building activities' },
      { src: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800&q=80&fit=crop', alt: isHe ? 'פעילויות מים' : 'Water activities', title: isHe ? 'פעילויות מים' : 'Water Activities', description: isHe ? 'הרפתקאות במים' : 'Water adventures' },
      { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&fit=crop', alt: isHe ? 'טיולים בטבע הצפון' : 'Hiking in northern nature', title: isHe ? 'טיולי טבע' : 'Nature Hikes', description: isHe ? 'סיורים מודרכים בטבע' : 'Guided nature tours' },
    ]
  }
];

export const LandscapeGallery = () => {
  const [activeSection, setActiveSection] = useState<string>('galilee');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const { language } = useLanguage();
  const isHe = language === 'he';

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
      setScrollY(window.scrollY);
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY * 0.3}px`);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const staticSections = useMemo(() => getStaticSections(isHe), [isHe]);

  const gallerySections = useMemo(() => {
    return staticSections.map(section => {
      const dbCategory = section.id === 'galilee' ? 'gilboa' 
        : section.id === 'gilboa' ? 'springs' 
        : 'activities';
      
      const dynamicForSection = (dynamicImages || [])
        .filter(img => img.category === dbCategory)
        .map(img => ({
          src: img.image_url,
          alt: img.alt_text,
          title: img.title,
          description: img.description || ''
        }));
      
      return { ...section, images: [...section.images, ...dynamicForSection] };
    });
  }, [dynamicImages, staticSections]);

  const currentSection = gallerySections.find(s => s.id === activeSection) || gallerySections[0];

  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return currentSection.images;
    const query = searchQuery.toLowerCase();
    return currentSection.images.filter(
      img => img.title.toLowerCase().includes(query) || img.description.toLowerCase().includes(query) || img.alt.toLowerCase().includes(query)
    );
  }, [currentSection.images, searchQuery]);

  const stats = [
    { number: '100+', label: isHe ? 'נופים מדהימים' : 'Stunning Landscapes', icon: Mountain },
    { number: '50+', label: isHe ? 'מיקומים ייחודיים' : 'Unique Locations', icon: Sparkles },
    { number: '10+', label: isHe ? 'אזורי טבע' : 'Nature Regions', icon: Mountain },
  ];

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
            <span className="font-medium">{isHe ? 'גלריית נופים' : 'Landscape Gallery'}</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="section-heading mb-4 bg-gradient-to-l from-primary via-foreground to-primary bg-clip-text text-transparent">
            {isHe ? 'הנופים המדהימים שלנו' : 'Our Stunning Landscapes'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-[1.7]">
            {isHe ? 'גלו את היופי הטבעי של אזור הגלבוע, הגליל והעמקים' : 'Discover the natural beauty of the Gilboa, Galilee and valley regions'}
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <Search className={`absolute ${isHe ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
            <Input
              type="text"
              placeholder={isHe ? 'חפש תמונות לפי שם או תיאור...' : 'Search images by name or description...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isHe ? 'pr-10' : 'pl-10'} bg-card/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 transition-all duration-300`}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {gallerySections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-500 relative overflow-hidden group
                ${activeSection === section.id 
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
                <p className="text-lg text-muted-foreground">{isHe ? 'לא נמצאו תמונות התואמות לחיפוש' : 'No images match your search'}</p>
                <p className="text-sm text-muted-foreground/70 mt-2">{isHe ? 'נסה מילות חיפוש אחרות' : 'Try different search terms'}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card className="text-center backdrop-blur-sm bg-card/30 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.2)] hover:scale-105 group">
                  <CardContent className="pt-6">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                    <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
