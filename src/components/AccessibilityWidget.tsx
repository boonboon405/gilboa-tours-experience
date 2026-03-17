import { useState, useEffect } from 'react';
import { useAccessibility } from '@/hooks/use-accessibility';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Accessibility, 
  Plus, 
  Minus, 
  Contrast, 
  Eye, 
  Link2, 
  Pause, 
  Type, 
  MousePointer2, 
  GripHorizontal,
  RotateCcw,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccessibilityWidget = () => {
  const { settings, updateSetting, resetSettings, increaseFontSize, decreaseFontSize } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [readingGuideY, setReadingGuideY] = useState(0);

  // Reading guide follows mouse
  useEffect(() => {
    if (!settings.readingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      setReadingGuideY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.readingGuide]);

  const accessibilityOptions = [
    {
      id: 'highContrast',
      label: 'ניגודיות גבוהה',
      icon: Contrast,
      value: settings.highContrast,
      onChange: (checked: boolean) => updateSetting('highContrast', checked),
    },
    {
      id: 'grayscale',
      label: 'גווני אפור',
      icon: Eye,
      value: settings.grayscale,
      onChange: (checked: boolean) => updateSetting('grayscale', checked),
    },
    {
      id: 'highlightLinks',
      label: 'הדגשת קישורים',
      icon: Link2,
      value: settings.highlightLinks,
      onChange: (checked: boolean) => updateSetting('highlightLinks', checked),
    },
    {
      id: 'stopAnimations',
      label: 'עצירת אנימציות',
      icon: Pause,
      value: settings.stopAnimations,
      onChange: (checked: boolean) => updateSetting('stopAnimations', checked),
    },
    {
      id: 'readableFont',
      label: 'גופן קריא',
      icon: Type,
      value: settings.readableFont,
      onChange: (checked: boolean) => updateSetting('readableFont', checked),
    },
    {
      id: 'largeCursor',
      label: 'סמן גדול',
      icon: MousePointer2,
      value: settings.largeCursor,
      onChange: (checked: boolean) => updateSetting('largeCursor', checked),
    },
    {
      id: 'readingGuide',
      label: 'סרגל קריאה',
      icon: GripHorizontal,
      value: settings.readingGuide,
      onChange: (checked: boolean) => updateSetting('readingGuide', checked),
    },
  ];

  return (
    <>
      {/* Skip to content link - visible on focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        דלג לתוכן הראשי
      </a>

      {/* Reading guide overlay */}
      {settings.readingGuide && (
        <div
          className="fixed left-0 right-0 h-12 bg-primary/20 pointer-events-none z-[9998] transition-transform duration-75"
          style={{ top: readingGuideY - 24 }}
          aria-hidden="true"
        />
      )}

      {/* Accessibility button and panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-24 left-4 z-[9999] h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary-foreground/20"
            aria-label="פתח תפריט נגישות"
          >
            <Accessibility className="h-7 w-7" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Accessibility className="h-6 w-6" />
              הגדרות נגישות
            </SheetTitle>
          </SheetHeader>

          {/* Font size controls */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-foreground">גודל טקסט</h3>
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseFontSize}
                disabled={settings.fontSize <= 80}
                aria-label="הקטן טקסט"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium min-w-[4rem] text-center">
                {settings.fontSize}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseFontSize}
                disabled={settings.fontSize >= 150}
                aria-label="הגדל טקסט"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Accessibility toggles */}
          <div className="space-y-4">
            {accessibilityOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <option.icon className="h-5 w-5 text-muted-foreground" />
                  <label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                    {option.label}
                  </label>
                </div>
                <Switch
                  id={option.id}
                  checked={option.value}
                  onCheckedChange={option.onChange}
                  aria-label={option.label}
                />
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Reset button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={resetSettings}
          >
            <RotateCcw className="h-4 w-4 ml-2" />
            איפוס הגדרות
          </Button>

          {/* Accessibility statement link */}
          <div className="mt-6 text-center">
            <Link
              to="/accessibility"
              className="text-sm text-primary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              הצהרת נגישות
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
