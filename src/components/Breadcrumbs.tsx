import { ChevronLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  className?: string;
}

export const Breadcrumbs = ({ items, onNavigate, className }: BreadcrumbsProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    }
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center gap-2 text-sm", className)}
    >
      {/* Home Icon */}
      <a
        href="#home"
        onClick={(e) => handleClick(e, '#home')}
        className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110"
        aria-label="חזור לדף הבית"
      >
        <Home className="h-4 w-4" />
      </a>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          {item.active ? (
            <span className="font-semibold text-primary">
              {item.label}
            </span>
          ) : (
            <a
              href={item.href}
              onClick={(e) => item.href && handleClick(e, item.href)}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
            >
              {item.label}
            </a>
          )}
        </div>
      ))}
    </nav>
  );
};
