import { useState, useRef, useCallback } from 'react';
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
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((href: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredItem(href);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Small delay to allow moving to dropdown
    timeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 150);
  }, []);

  return (
    <nav className="hidden lg:flex items-center gap-1 relative z-50" role="menubar">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.href.replace('#', '');
        const isHovered = hoveredItem === item.href;

        return (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.href)}
            onMouseLeave={handleMouseLeave}
            role="none"
          >
            <a
              href={item.href}
              onClick={(e) => {
                onNavClick(e, item.href);
                setHoveredItem(null);
              }}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={isHovered}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium relative group overflow-hidden",
                "transition-all duration-300 ease-out",
                isActive 
                  ? "text-primary bg-primary/10 shadow-[0_8px_30px_hsl(var(--primary)/0.2)] scale-105" 
                  : "text-foreground hover:text-primary hover:bg-accent/50 hover:shadow-[0_4px_20px_hsl(var(--primary)/0.15)] hover:scale-105"
              )}
            >
              {/* Animated background gradient */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              
              <Icon className={cn(
                "h-4 w-4 relative z-10 transition-all duration-300 ease-out",
                isHovered && "scale-110 text-primary",
                isActive && "text-primary"
              )} />
              <span className="whitespace-nowrap relative z-10">{item.label}</span>
              <ChevronDown className={cn(
                "h-3 w-3 relative z-10 transition-transform duration-300 ease-out",
                isHovered && "rotate-180"
              )} />
              
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}

              {/* Hover Glow Effect */}
              <span className={cn(
                "absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )} />
            </a>

            {/* Mega Menu Dropdown */}
            <div 
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[380px] z-[100]",
                "transition-all duration-300 ease-out",
                isHovered 
                  ? "opacity-100 visible translate-y-0" 
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              )}
              role="menu"
              aria-label={`תפריט ${item.label}`}
            >
              <div className="bg-card border-2 border-primary/20 rounded-xl shadow-[0_20px_70px_hsl(var(--primary)/0.3),0_0_40px_hsl(var(--primary)/0.1)] overflow-hidden relative">
                {/* Arrow pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-t-2 border-l-2 border-primary/20 rotate-45 z-10" />
                
                {/* Image Header with Skeleton */}
                <div className="relative h-40 overflow-hidden group/image">
                  {!imageLoaded[item.href] && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                  )}
                  <img 
                    src={item.image} 
                    alt={item.label}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-110",
                      !imageLoaded[item.href] && "opacity-0"
                    )}
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [item.href]: true }))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
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
                    className="pb-3 border-b border-border"
                  />
                  
                  {/* Highlights */}
                  <div className="space-y-2">
                    {item.highlights.map((highlight, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 text-sm text-foreground/80"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a
                    href={item.href}
                    onClick={(e) => {
                      onNavClick(e, item.href);
                      setHoveredItem(null);
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.4)] hover:scale-[1.02] flex items-center justify-center gap-2 relative overflow-hidden group/button"
                    role="menuitem"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-500" />
                    <span className="relative z-10">עבור ל{item.label}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 relative z-10 transition-transform duration-300 group-hover/button:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
};