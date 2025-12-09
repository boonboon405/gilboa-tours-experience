import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-primary/10 transition-colors"
          title={language === 'he' ? 'שנה שפה' : 'Change language'}
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => setLanguage('he')}
          className={`flex items-center gap-2 cursor-pointer ${language === 'he' ? 'bg-primary/10 text-primary font-medium' : ''}`}
        >
          <span className="text-lg">🇮🇱</span>
          <span>עברית</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-2 cursor-pointer ${language === 'en' ? 'bg-primary/10 text-primary font-medium' : ''}`}
        >
          <span className="text-lg">🇺🇸</span>
          <span>English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
