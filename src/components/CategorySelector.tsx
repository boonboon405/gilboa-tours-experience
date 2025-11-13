import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Droplets, Landmark, Wine, Zap, Palette, Leaf, Handshake } from 'lucide-react';
import { categoryMetadata, DNACategory } from '@/utils/activityCategories';

interface CategorySelectorProps {
  onSelect: (categories: string[]) => void;
  disabled?: boolean;
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

export const CategorySelector = ({ onSelect, disabled }: CategorySelectorProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    if (selected.size > 0) {
      onSelect(Array.from(selected));
    }
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
      <p className="text-sm text-center font-medium">בחרו את הקטגוריות שמעניינות אתכם:</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {(Object.keys(categoryMetadata) as DNACategory[]).map((category) => {
          const meta = categoryMetadata[category];
          const Icon = categoryIcons[category];
          const isSelected = selected.has(category);

          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              disabled={disabled}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 
                transition-all duration-300 ease-out
                ${isSelected 
                  ? 'border-primary bg-primary/10 shadow-lg scale-105 animate-scale-in' 
                  : 'border-border/30 bg-background hover:border-primary/50 hover:bg-muted/50 hover:scale-105 hover:shadow-md'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
              `}
            >
              <Icon className={`w-6 h-6 transition-all duration-300 ${isSelected ? 'text-primary scale-110' : 'text-muted-foreground'}`} />
              <div className="text-center">
                <p className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {meta.name}
                </p>
              </div>
              {isSelected && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary animate-scale-in">
                  ✓
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={disabled || selected.size === 0}
          className="w-full max-w-xs"
        >
          שלח בחירה ({selected.size})
        </Button>
      </div>
    </div>
  );
};
