import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const getRegions = (lang: string) => [
  {
    id: 'north',
    region: lang === 'he' ? '🌿 צפון הארץ' : '🌿 Northern Israel',
    highlights: lang === 'he' ? [
      'ראש הנקרה – הנקרות הלבנות והנוף לים התיכון',
      'עכו העתיקה – חומות, נמל ומנהרת הטמפלרים',
      'צפת העתיקה – סמטאות, גלריות וקבלה',
      'הכנרת – חופי רחצה ואתרים היסטוריים',
      'שמורת הבניאס – מפלים ומקדש פאן',
    ] : [
      'Rosh HaNikra – White grottoes and Mediterranean views',
      'Old Acre – Walls, port, and Templar tunnel',
      'Old Safed – Alleys, galleries, and Kabbalah',
      'Sea of Galilee – Beaches and historical sites',
      'Banias Nature Reserve – Waterfalls and Pan temple',
    ],
  },
  {
    id: 'valley',
    region: lang === 'he' ? '🏞 עמק יזרעאל והגלבוע' : '🏞 Jezreel Valley & Gilboa',
    highlights: lang === 'he' ? [
      'הר הגלבוע – פריחה עונתית ונוף מרהיב',
      'בית שאן – עתיקות רומיות מרשימות',
      'גן השלושה (סחנה) – מים חמימים כל השנה',
      'נחל הקיבוצים – מסלול מים חווייתי',
      'יקב תבור – טעימות יין ונוף',
    ] : [
      'Mount Gilboa – Seasonal blooms and stunning views',
      'Beit She\'an – Impressive Roman ruins',
      'Gan HaShlosha (Sachne) – Warm water year-round',
      'Nahal HaKibbutzim – Experiential water trail',
      'Tabor Winery – Wine tasting and scenery',
    ],
  },
  {
    id: 'jerusalem',
    region: lang === 'he' ? '🕍 ירושלים' : '🕍 Jerusalem',
    highlights: lang === 'he' ? [
      'העיר העתיקה – הכותל, כנסיית הקבר, הר הבית',
      'יד ושם – מוזיאון השואה הלאומי',
      'מוזיאון ישראל',
      'שוק מחנה יהודה',
      'עיר דוד – ארכאולוגיה מימי בית ראשון',
    ] : [
      'Old City – Western Wall, Church of the Holy Sepulchre',
      'Yad Vashem – National Holocaust Museum',
      'Israel Museum',
      'Mahane Yehuda Market',
      'City of David – First Temple archaeology',
    ],
  },
  {
    id: 'south',
    region: lang === 'he' ? '🏜 הדרום ומדבר יהודה' : '🏜 Southern Israel & Judean Desert',
    highlights: lang === 'he' ? [
      'ים המלח – הנקודה הנמוכה בעולם',
      'מצדה – סמל הגבורה וגבורת עולמית',
      'עין גדי – נווה מדבר ומסלולי מים',
      'מכתש רמון – פלא גאולוגי עולמי',
      'אילת – שנורקלינג ושמורת האלמוגים',
    ] : [
      'Dead Sea – Lowest point on earth',
      'Masada – Symbol of heroism, UNESCO site',
      'Ein Gedi – Desert oasis and water trails',
      'Ramon Crater – Geological wonder',
      'Eilat – Snorkeling and coral reef reserve',
    ],
  },
];

export const VIPTours = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const regions = getRegions(language);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '', guests: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const toggle = (regionId: string, site: string) => {
    setSelected(prev => {
      const current = prev[regionId] || [];
      return {
        ...prev,
        [regionId]: current.includes(site)
          ? current.filter(s => s !== site)
          : [...current, site],
      };
    });
  };

  const totalSelected = Object.values(selected).flat().length;

  const handleSend = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast({ title: language === 'he' ? 'אנא מלאו פרטי קשר' : 'Please fill contact details', variant: 'destructive' });
      return;
    }
    setIsSending(true);
    try {
      const selectedList = Object.entries(selected)
        .filter(([_, items]) => items.length > 0)
        .map(([regionId, items]) => {
          const region = regions.find(r => r.id === regionId);
          return `${region?.region}:\n${items.map(i => `  • ${i}`).join('\n')}`;
        }).join('\n\n');

      await supabase.functions.invoke('send-preferences-email', {
        body: {
          ...contactInfo,
          selectedActivities: selectedList,
          type: 'vip-tours',
        },
      });
      toast({ title: language === 'he' ? 'הבחירות נשלחו בהצלחה!' : 'Preferences sent successfully!' });
      setSelected({});
      setContactInfo({ name: '', email: '', phone: '', guests: '', message: '' });
    } catch {
      toast({ title: language === 'he' ? 'שגיאה בשליחה' : 'Error sending', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {language === 'he' ? 'סיורי VIP לאורחים מחו"ל' : 'VIP Tours for International Guests'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'he'
                ? 'בחרו יעדים מכל אזור ונבנה עבורכם מסלול מושלם'
                : 'Select destinations from each region and we\'ll build your perfect itinerary'}
            </p>
          </div>

          <div className="space-y-4">
            {regions.map((region) => (
              <div key={region.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                <button
                  className="w-full p-6 flex items-center justify-between text-start hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedRegion(expandedRegion === region.id ? null : region.id)}
                >
                  <h3 className="text-lg font-semibold">{region.region}</h3>
                  <div className="flex items-center gap-3">
                    {(selected[region.id]?.length || 0) > 0 && (
                      <span className="text-xs font-medium bg-accent text-accent-foreground px-2 py-1 rounded-full">
                        {selected[region.id].length}
                      </span>
                    )}
                    {expandedRegion === region.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>
                {expandedRegion === region.id && (
                  <div className="px-6 pb-6 space-y-2">
                    {region.highlights.map((site) => {
                      const isSelected = selected[region.id]?.includes(site);
                      return (
                        <button
                          key={site}
                          onClick={() => toggle(region.id, site)}
                          className={`w-full text-start p-3 rounded-xl text-sm transition-all ${
                            isSelected
                              ? 'bg-accent/10 border border-accent text-foreground'
                              : 'bg-muted/50 hover:bg-muted border border-transparent text-muted-foreground'
                          }`}
                        >
                          {site}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalSelected > 0 && (
            <div className="mt-8 p-8 rounded-2xl border border-border bg-card space-y-4 animate-fade-in">
              <h3 className="font-semibold text-lg">
                {language === 'he' ? `נבחרו ${totalSelected} יעדים – השאירו פרטים` : `${totalSelected} destinations selected – leave your details`}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder={language === 'he' ? 'שם מלא' : 'Full Name'}
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder={language === 'he' ? 'דוא"ל' : 'Email'}
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                />
                <Input
                  type="tel"
                  placeholder={language === 'he' ? 'טלפון' : 'Phone'}
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                />
                <Input
                  placeholder={language === 'he' ? 'מספר אורחים' : 'Number of guests'}
                  value={contactInfo.guests}
                  onChange={(e) => setContactInfo({ ...contactInfo, guests: e.target.value })}
                />
              </div>
              <Textarea
                placeholder={language === 'he' ? 'בקשות מיוחדות...' : 'Special requests...'}
                value={contactInfo.message}
                onChange={(e) => setContactInfo({ ...contactInfo, message: e.target.value })}
                rows={3}
              />
              <Button onClick={handleSend} disabled={isSending} size="lg" className="w-full">
                <Send className="h-4 w-4" />
                {isSending ? (language === 'he' ? 'שולח...' : 'Sending...') : (language === 'he' ? 'שלחו את הבחירות' : 'Send Preferences')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
