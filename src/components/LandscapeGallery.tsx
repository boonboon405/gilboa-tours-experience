import { useState, useMemo, useEffect } from 'react';
import { Mountain, Sparkles, Search } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import galileeNature from '@/assets/galilee-nature.jpg';
import springsNature from '@/assets/springs-nature.jpg';
import heroGilboa from '@/assets/hero-gilboa.jpg';
import clubCars from '@/assets/club-cars.jpg';
import culinary from '@/assets/culinary-experience.jpg';
import beitShean from '@/assets/beit-shean.jpg';
import pelicans from '@/assets/pelicans.jpg';
import springsActivity from '@/assets/springs-activity.jpg';
import odtTeam from '@/assets/odt-team.jpg';

interface GallerySection {
  id: string;
  title: string;
  description: string;
  images: { src: string; alt: string; title: string; description: string }[];
}

const gallerySections: GallerySection[] = [
  {
    id: 'galilee',
    title: 'הגליל והכנרת',
    description: 'נופים עוצרי נשימה של אזור הגליל והכנרת',
    images: [
      { src: galileeNature, alt: 'נוף ירוק ופורח של הרי הגליל עם עצי אלון ואורנים צופים לעבר עמקים פוריים', title: 'נופי הגליל', description: 'נוף פנורמי של הרי הגליל' },
      { src: pelicans, alt: 'להקת שקנאים ופלמינגו בנדידה מעל אגמון החולה בשבר הסורי אפריקאי', title: 'נדידת ציפורים', description: 'חיות בר באגמון החולה' },
      { src: beitShean, alt: 'שרידי העיר הרומית סקיתופוליס בבית שאן - עמודים ופסיפסים עתיקים על רקע הרי הגלבוע', title: 'עמק בית שאן', description: 'נוף היסטורי מרהיב' },
      { src: springsNature, alt: 'מעיינות הכנרת והגליל - מים צלולים בלב הטבע הירוק', title: 'מעיינות הגליל', description: 'מעיינות טבעיים באזור' },
      { src: culinary, alt: 'טעמי הגליל - יין ומטעמים מקומיים מהאזור', title: 'טעמי הגליל', description: 'חוויות קולינריות באזור' },
    ]
  },
  {
    id: 'gilboa',
    title: 'הרי הגלבוע',
    description: 'הפנינה הטבעית של צפון הארץ',
    images: [
      { src: heroGilboa, alt: 'תצפית עוצרת נשימה מפסגת הרי הגלבוע אל עמק המעיינות ועמק הירדן בשקיעה זהובה', title: 'הרי הגלבוע', description: 'שקיעה מדהימה מפסגות הגלבוע' },
      { src: springsNature, alt: 'מעיינות צלולים וטבעיים בגן השלושה (סחנה) מוקפים בצמחייה טרופית ודקלים', title: 'עמק המעיינות', description: 'מעיינות צלולים בלב הטבע' },
      { src: springsActivity, alt: 'קבוצת מטיילים נהנית מפעילות מים ושחייה במעיינות הטבעיים של עמק המעיינות', title: 'פעילויות במעיינות', description: 'חוויות ייחודיות במים' },
      { src: beitShean, alt: 'נוף פנורמי של עמק בית שאן מפסגות הגלבוע', title: 'תצפית העמק', description: 'מבט לעמק מהפסגה' },
      { src: clubCars, alt: 'טיול רכבי שטח בשבילי הגלבוע', title: 'טיולי שטח', description: 'הרפתקאות בגלבוע' },
    ]
  },
  {
    id: 'activities',
    title: 'פעילויות וחוויות',
    description: 'מגוון פעילויות מרתקות בטבע',
    images: [
      { src: clubCars, alt: 'רכבי שטח חשמליים מתמרנים בשבילי הגלבוע במהלך פעילות גיבוש צוותית אתגרית', title: 'רכבי שטח חשמליים', description: 'טיולים מאתגרים בשטח' },
      { src: culinary, alt: 'שולחן ערוך עם מטעמים מקומיים - יין בוטיק, גבינות עזים, שמן זית וסלטים טריים מהאזור', title: 'חוויות קולינריות', description: 'טעמים אותנטיים של האזור' },
      { src: odtTeam, alt: 'צוות עובדים בפעילות גיבוש ODT - אימון פיתוח חוץ הכולל אתגרים קבוצתיים בטבע', title: 'גיבוש ODT', description: 'פעילויות גיבוש צוותיות' },
      { src: springsActivity, alt: 'פעילויות מים ורפטינג בנחלות האזור', title: 'פעילויות מים', description: 'הרפתקאות במים' },
      { src: galileeNature, alt: 'טיולים וסיורים בטבע הפראי של הצפון', title: 'טיולי טבע', description: 'סיורים מודרכים בטבע' },
    ]
  }
];

export const LandscapeGallery = () => {
  const [activeSection, setActiveSection] = useState<string>('galilee');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      // Update CSS variable for parallax
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY * 0.3}px`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSection = gallerySections.find(s => s.id === activeSection) || gallerySections[0];

  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return currentSection.images;
    
    const query = searchQuery.toLowerCase();
    return currentSection.images.filter(
      img => 
        img.title.toLowerCase().includes(query) ||
        img.description.toLowerCase().includes(query) ||
        img.alt.toLowerCase().includes(query)
    );
  }, [currentSection.images, searchQuery]);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-accent/5 to-background relative overflow-hidden">
      {/* Background decorative elements with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse transition-transform duration-1000 ease-out"
          style={{ transform: 'translateY(var(--scroll-y, 0))' }}
        />
        <div 
          className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-pulse [animation-delay:2s] transition-transform duration-1000 ease-out"
          style={{ transform: 'translateY(calc(var(--scroll-y, 0) * -0.5))' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Mountain className="h-5 w-5" />
            <span className="font-medium">גלריית נופים</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-primary via-foreground to-primary bg-clip-text text-transparent">
            הנופים המדהימים שלנו
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            גלו את היופי הטבעי של אזור הגלבוע, הגליל והעמקים
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חפש תמונות לפי שם או תיאור..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-card/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {gallerySections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-500 relative overflow-hidden group
                ${activeSection === section.id 
                  ? 'bg-primary text-primary-foreground shadow-[0_8px_30px_hsl(var(--primary)/0.3)] scale-105' 
                  : 'bg-card hover:bg-accent border border-border hover:border-primary/50 hover:shadow-lg hover:scale-105'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated background */}
              {activeSection !== section.id && (
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
              <span className="relative z-10">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Gallery Content */}
        <Card 
          key={activeSection}
          className="backdrop-blur-sm bg-card/50 border-2 border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-700"
        >
          <CardHeader className="text-center animate-in slide-in-from-top-4 fade-in duration-500">
            <CardTitle className="text-3xl font-bold">{currentSection.title}</CardTitle>
            <CardDescription className="text-lg">{currentSection.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredImages.length > 0 ? (
              <ImageGallery 
                images={filteredImages}
                layout="grid"
              />
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg text-muted-foreground">לא נמצאו תמונות התואמות לחיפוש</p>
                <p className="text-sm text-muted-foreground/70 mt-2">נסה מילות חיפוש אחרות</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { number: '100+', label: 'נופים מדהימים', icon: Mountain },
            { number: '50+', label: 'מיקומים ייחודיים', icon: Sparkles },
            { number: '10+', label: 'אזורי טבע', icon: Mountain },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="text-center backdrop-blur-sm bg-card/30 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.2)] hover:scale-105 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
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
