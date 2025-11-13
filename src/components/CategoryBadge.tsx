import { Badge } from '@/components/ui/badge';
import { Flame, Droplets, Landmark, Wine, Zap, Palette, Leaf, Handshake } from 'lucide-react';
import { categoryMetadata, DNACategory } from '@/utils/activityCategories';

interface CategoryBadgeProps {
  category: DNACategory;
  size?: 'sm' | 'md';
}

const categoryIcons: Record<DNACategory, any> = {
  adventure: Flame,
  nature: Droplets,
  history: Landmark,
  culinary: Wine,
  sports: Zap,
  creative: Palette,
  wellness: Leaf,
  teambuilding: Handshake
};

export const CategoryBadge = ({ category, size = 'sm' }: CategoryBadgeProps) => {
  const meta = categoryMetadata[category];
  const Icon = categoryIcons[category];
  
  return (
    <Badge 
      variant="secondary"
      className={`
        inline-flex items-center gap-1 
        bg-gradient-to-r ${meta.color} 
        text-white border-0 
        hover:scale-105 transition-transform duration-200
        ${size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'}
        animate-fade-in
      `}
    >
      <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      <span>{meta.name.split(',')[0]}</span>
    </Badge>
  );
};
