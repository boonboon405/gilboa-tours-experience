import { useState } from 'react';
import { ChevronDown, Home, Users, Star, Target, Phone, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import heroImage from '@/assets/hero-gilboa.jpg';
import clubCarsImage from '@/assets/club-cars.jpg';
import odtTeamImage from '@/assets/odt-team.jpg';
import culinaryImage from '@/assets/culinary-experience.jpg';
import galileeNature from '@/assets/galilee-nature.jpg';
import springsNature from '@/assets/springs-nature.jpg';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  description: string;
  highlights: string[];
}

interface MegaMenuProps {
  activeSection: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const menuItems: MenuItem[] = [
  {
    label: 'בית',
    href: '#home',
    icon: Home,
    image: galileeNature,
    description: 'גלה את הגלבוע והעמק הירדן',
    highlights: ['נופים פנורמיים', 'חוויות ייחודיות', 'מקצועיות ואיכות']
  },
  {
    label: 'יום כייף וגיבוש לחברות',
    href: '#choose-your-day',
    icon: Users,
    image: clubCarsImage,
    description: 'יום מלא בפעילויות מגבשות',
    highlights: ['100+ פעילויות', 'Quiz מותאם אישית', 'חוויות בטבע']
  },
  {
    label: 'טיולי VIP לאורחי חברות מחו״ל',
    href: '#vip-tours',
    icon: Star,
    image: culinaryImage,
    description: 'חוויות VIP מותאמות אישית',
    highlights: ['שירות יוקרתי', 'מדריכי שפות', 'התאמה אישית']
  },
  {
    label: 'גיבוש ODT',
    href: '#odt-section',
    icon: Target,
    image: odtTeamImage,
    description: 'תוכניות גיבוש צוותיות מתקדמות',
    highlights: ['בניית צוות', 'אתגרים מקצועיים', 'חוויה משמעותית']
  },
  {
    label: 'צור קשר',
    href: '#contact',
    icon: Phone,
    image: springsNature,
    description: 'נשמח לעזור ולייעץ',
    highlights: ['שירות אישי', 'מענה מהיר', 'ייעוץ מקצועי']
  }
];

export const MegaMenu = ({ activeSection, onNavClick }: MegaMenuProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  return (
    <div className="hidden lg:flex items-center gap-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.href.replace('#', '');
        const isHovered = hoveredItem === item.href;

        return (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={() => {
              setHoveredItem(item.href);
              setIsMenuOpen(true);
            }}
            onMouseLeave={() => {
              setHoveredItem(null);
              setIsMenuOpen(false);
            }}
          >
            <a
              href={item.href}
              onClick={(e) => {
                onNavClick(e, item.href);
                setIsMenuOpen(false);
                setHoveredItem(null);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 relative group",
                isActive 
                  ? "text-primary bg-primary/10 shadow-sm" 
                  : "text-foreground hover:text-primary hover:bg-accent/50"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 transition-transform duration-300",
                isHovered && "scale-110 rotate-6"
              )} />
              <span className="whitespace-nowrap">{item.label}</span>
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform duration-300",
                isHovered && "rotate-180"
              )} />
              
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-in fade-in slide-in-from-bottom-1" />
              )}

              {/* Hover Glow Effect */}
              {isHovered && (
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-in fade-in zoom-in-95 duration-300" />
              )}
            </a>

            {/* Mega Menu Dropdown */}
            {isHovered && isMenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[380px] animate-in fade-in slide-in-from-top-2 duration-300 z-[100]">
                <div className="bg-card/98 backdrop-blur-xl border-2 border-border rounded-xl shadow-2xl overflow-hidden">
                  {/* Image Header with Skeleton */}
                  <div className="relative h-40 overflow-hidden group/image">
                    {!imageLoaded[item.href] && (
                      <Skeleton className="absolute inset-0 w-full h-full" />
                    )}
                    <img 
                      src={item.image} 
                      alt={item.label}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-500 group-hover/image:scale-110",
                        !imageLoaded[item.href] && "opacity-0"
                      )}
                      onLoad={() => setImageLoaded(prev => ({ ...prev, [item.href]: true }))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 right-4 left-4">
                      <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </h3>
                      <p className="text-white/90 text-sm">{item.description}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    {/* Breadcrumbs */}
                    <Breadcrumbs
                      items={[
                        { label: item.label, active: true }
                      ]}
                      className="pb-3 border-b"
                    />
                    
                    {/* Highlights */}
                    <div className="space-y-2">
                      {item.highlights.map((highlight, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 text-sm text-foreground/80 animate-in slide-in-from-right-2 duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        const anchor = e.currentTarget.closest('.relative')?.querySelector('a') as HTMLAnchorElement;
                        if (anchor) anchor.click();
                      }}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <span>עבור ל{item.label}</span>
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </button>
                  </div>

                  {/* Arrow pointer */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-t-2 border-l-2 border-border rotate-45" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
