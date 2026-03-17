import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const getSections = (lang: string) => [
  {
    id: 'morning',
    title: lang === 'he' ? '🌅 בוקר – הרפתקאות ושבירת קרח' : '🌅 Morning – Adventure & Icebreakers',
    time: '09:00 - 11:30',
    topPicks: lang === 'he' ? [
      'הליכה במי נחל הקיבוצים (ראלי מכשולים צוותי)',
      'אתגר רכבי שטח דרך גבעות הגלבוע',
      'חוויית כדור פורח מעל העמק',
      'מסע אל רכס הגלבוע – 7 תצפיות נוף',
      'קיאקים ואתגר חתירה קבוצתי',
    ] : [
      'Hiking through Nahal HaKibbutzim creek (team obstacle rally)',
      'Off-road vehicle challenge through the Gilboa hills',
      'Hot air balloon experience over the valley',
      'Journey to the Gilboa ridge – 7 viewpoints',
      'Group kayak challenge',
    ],
  },
  {
    id: 'noon',
    title: lang === 'he' ? '💧 צהריים – מעיינות ומשחקי מים' : '💧 Noon – Springs & Water Activities',
    time: '11:30 - 13:30',
    topPicks: lang === 'he' ? [
      'אתגר רכבים חשמליים דרך 4 מעיינות',
      'שחייה בגן השלושה (סחנה)',
      'גלישת סאפ בנהר הירדן',
      'פיקניק תחת עצי דקל ליד מעיין עין מודע',
      'משחקי מים מיני-אולימפיים',
    ] : [
      'Electric vehicle challenge through 4 natural springs',
      'Swimming at Gan HaShlosha (Sachne)',
      'SUP on the Jordan River',
      'Picnic under palm trees near Ein Moda spring',
      'Mini-Olympic water games',
    ],
  },
  {
    id: 'afternoon',
    title: lang === 'he' ? '🏛️ אחר הצהריים – היסטוריה ותרבות' : '🏛️ Afternoon – History & Culture',
    time: '13:30 - 15:30',
    topPicks: lang === 'he' ? [
      'סיור מודרך בעיר הרומית בית שאן',
      'פסיפס בית הכנסת בית אלפא',
      'תצפית הר הגלבוע – סיפור המלך שאול',
      'מוזיאון האמנות של עין חרוד',
      'ביקור בחוות חלב קיבוצית',
    ] : [
      'Guided tour of ancient Roman city Beit She\'an',
      'Beit Alpha synagogue mosaic',
      'Gilboa mountain viewpoint – King Saul\'s story',
      'Ein Harod art museum',
      'Visit a local kibbutz dairy farm',
    ],
  },
  {
    id: 'evening',
    title: lang === 'he' ? '🍷 ערב – קולינריה ויין' : '🍷 Evening – Culinary & Wine',
    time: '15:30 - 17:00',
    topPicks: lang === 'he' ? [
      'ארוחה עשירה במסעדה כשרה עם אוכל מזרחי אותנטי',
      'טעימת יין ביקב בוטיק מקומי',
      'אתגר בישול פויקה מסורתי (תחרות צוותים)',
      'סדנת שמן זית וטעימה',
      'סיום מתוק בפסגת הגלבוע עם יין ונוף',
    ] : [
      'Rich meal at a kosher restaurant with authentic Middle Eastern cuisine',
      'Wine tasting at a local boutique winery',
      'Traditional campfire cooking challenge (team competition)',
      'Olive oil workshop and tasting',
      'Sweet ending at the Gilboa summit with wine and views',
    ],
  },
];

export const ChooseYourDay = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const sections = getSections(language);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const toggle = (sectionId: string, activity: string) => {
    setSelected(prev => {
      const current = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: current.includes(activity)
          ? current.filter(a => a !== activity)
          : [...current, activity],
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
        .map(([sectionId, items]) => {
          const section = sections.find(s => s.id === sectionId);
          return `${section?.title}:\n${items.map(i => `  • ${i}`).join('\n')}`;
        }).join('\n\n');

      await supabase.functions.invoke('send-preferences-email', {
        body: {
          ...contactInfo,
          selectedActivities: selectedList,
          type: 'choose-your-day',
        },
      });
      toast({ title: language === 'he' ? 'הבחירות נשלחו בהצלחה!' : 'Preferences sent successfully!' });
      setSelected({});
      setContactInfo({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast({ title: language === 'he' ? 'שגיאה בשליחה' : 'Error sending', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {language === 'he' ? 'בנו את יום הכיף שלכם' : 'Build Your Fun Day'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'he'
                ? 'בחרו פעילויות מכל חלק של היום ונתאים עבורכם את החבילה המושלמת'
                : 'Pick activities from each part of the day and we\'ll create the perfect package'}
            </p>
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                <button
                  className="w-full p-6 flex items-center justify-between text-start hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(selected[section.id]?.length || 0) > 0 && (
                      <span className="text-xs font-medium bg-accent text-accent-foreground px-2 py-1 rounded-full">
                        {selected[section.id].length}
                      </span>
                    )}
                    {expandedSection === section.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>
                {expandedSection === section.id && (
                  <div className="px-6 pb-6 space-y-2">
                    {section.topPicks.map((activity) => {
                      const isSelected = selected[section.id]?.includes(activity);
                      return (
                        <button
                          key={activity}
                          onClick={() => toggle(section.id, activity)}
                          className={`w-full text-start p-3 rounded-xl text-sm transition-all ${
                            isSelected
                              ? 'bg-accent/10 border border-accent text-foreground'
                              : 'bg-muted/50 hover:bg-muted border border-transparent text-muted-foreground'
                          }`}
                        >
                          {activity}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          {totalSelected > 0 && (
            <div className="mt-8 p-8 rounded-2xl border border-border bg-card space-y-4 animate-fade-in">
              <h3 className="font-semibold text-lg">
                {language === 'he' ? `נבחרו ${totalSelected} פעילויות – השאירו פרטים ונחזור אליכם` : `${totalSelected} activities selected – leave your details`}
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
              </div>
              <Textarea
                placeholder={language === 'he' ? 'הערות נוספות...' : 'Additional notes...'}
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
