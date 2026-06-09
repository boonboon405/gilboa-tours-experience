import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { israelImages, getIsraelImage, getIsraelImageSrcSet } from '@/data/israelImages';
import { useLanguage } from '@/contexts/LanguageContext';

interface ODTType {
  id: number;
  titleHe: string;
  titleEn: string;
  descriptionHe: string;
  descriptionEn: string;
  imageKey: string;
}

const odtTypes: ODTType[] = [
  {
    id: 1,
    titleHe: 'משחקי אמון',
    titleEn: 'Trust Games',
    descriptionHe: 'פעילויות שבהן חברי הצוות חייבים לסמוך אחד על השני כדי להצליח.',
    descriptionEn: 'Activities where team members must trust each other to succeed.',
    imageKey: 'mount-gilboa'
  },
  {
    id: 2,
    titleHe: 'פתרון בעיות יצירתי',
    titleEn: 'Creative Problem Solving',
    descriptionHe: 'אתגרים הדורשים חשיבה יצירתית ופתרון בעיות קבוצתי.',
    descriptionEn: 'Challenges requiring creative thinking and group problem solving.',
    imageKey: 'sea-of-galilee'
  },
  {
    id: 3,
    titleHe: 'מסלולי חבלים גבוהים',
    titleEn: 'High Ropes Course',
    descriptionHe: 'מסלולי אתגר בגובה הדורשים אומץ, איזון ותמיכה צוותית.',
    descriptionEn: 'Challenging high courses requiring courage, balance, and team support.',
    imageKey: 'gan-hashlosha'
  },
  {
    id: 4,
    titleHe: 'ניווט והתמצאות',
    titleEn: 'Navigation & Orienteering',
    descriptionHe: 'שימוש במפה ומצפן לניווט בשטח.',
    descriptionEn: 'Using map and compass for field navigation.',
    imageKey: 'nahal-ayun'
  },
  {
    id: 5,
    titleHe: 'בניית רפסודות',
    titleEn: 'Raft Building',
    descriptionHe: 'צוותים בונים רפסודות מחומרים בסיסיים ומפליגים עליהן.',
    descriptionEn: 'Teams build rafts from basic materials and sail on them.',
    imageKey: 'mount-arbel'
  },
  {
    id: 6,
    titleHe: 'קיר טיפוס צוותי',
    titleEn: 'Team Climbing Wall',
    descriptionHe: 'אתגר בו כל חברי הצוות חייבים לעבור מעבר קיר גבוה יחד.',
    descriptionEn: 'Challenge where all team members must cross a high wall together.',
    imageKey: 'mount-tabor'
  },
  {
    id: 7,
    titleHe: 'חיפוש אוצר',
    titleEn: 'Treasure Hunt',
    descriptionHe: 'משחק התמצאות עם רמזים ומשימות.',
    descriptionEn: 'Orienteering game with clues and challenges.',
    imageKey: 'hula-valley'
  },
  {
    id: 8,
    titleHe: 'מסלולי שרידות',
    titleEn: 'Survival Courses',
    descriptionHe: 'לימוד מיומנויות שרידות בסיסיות כמו הבערת אש, בניית מחסה.',
    descriptionEn: 'Learning basic survival skills like fire-making and shelter building.',
    imageKey: 'jordan-river'
  },
  {
    id: 9,
    titleHe: 'הליכה מודרכת בטבע',
    titleEn: 'Guided Nature Walk',
    descriptionHe: 'מסעות הליכה ארוכים בטבע עם משימות לאורך הדרך.',
    descriptionEn: 'Long nature hikes with challenges along the way.',
    imageKey: 'golan-heights'
  },
  {
    id: 10,
    titleHe: 'משחקי מנהיגות',
    titleEn: 'Leadership Games',
    descriptionHe: 'פעילויות שבהן חברי צוות מסתובבים בתפקידי מנהיגות.',
    descriptionEn: 'Activities where team members rotate leadership roles.',
    imageKey: 'jezreel-valley'
  },
  {
    id: 11,
    titleHe: 'אתגרי תקשורת',
    titleEn: 'Communication Challenges',
    descriptionHe: 'משימות המדגישות את חשיבות התקשורת הברורה.',
    descriptionEn: 'Tasks emphasizing the importance of clear communication.',
    imageKey: 'banias-waterfall'
  },
  {
    id: 12,
    titleHe: 'קמפינג צוותי',
    titleEn: 'Team Camping',
    descriptionHe: 'חנייה ללילה בטבע עם פעילויות שיתופיות.',
    descriptionEn: 'Overnight camping with collaborative activities.',
    imageKey: 'nahal-snir'
  },
  {
    id: 13,
    titleHe: 'ספורט הרפתקאות',
    titleEn: 'Adventure Sports',
    descriptionHe: 'פעילויות כמו רפטינג, קיאקינג או טיפוס סלעים.',
    descriptionEn: 'Activities like rafting, kayaking, or rock climbing.',
    imageKey: 'rosh-hanikra'
  },
  {
    id: 14,
    titleHe: 'סדנאות סביבתיות',
    titleEn: 'Environmental Workshops',
    descriptionHe: 'פעילויות שמחברות בין גיבוש צוות לבין מודעות סביבתית.',
    descriptionEn: 'Activities connecting team building with environmental awareness.',
    imageKey: 'mount-meron'
  },
  {
    id: 15,
    titleHe: 'אתגרי זמן',
    titleEn: 'Time Challenges',
    descriptionHe: 'משימות עם מגבלות זמן קפדניות הדורשות תכנון מהיר.',
    descriptionEn: 'Tasks with strict time limits requiring quick planning.',
    imageKey: 'mount-hermon'
  }
];

interface ODTTypesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ODTTypesDialog = ({ open, onOpenChange }: ODTTypesDialogProps) => {
  const { language } = useLanguage();
  const isHe = language === 'he';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">
            {isHe ? '15 סוגי פעילויות ODT' : '15 Types of ODT Activities'}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {isHe ? 'בחר במתאים לכם, פעילויות לגיבוש הצוות שלך בטבע' : 'Choose what fits you — outdoor team-building activities'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {odtTypes.map((odtType) => (
            <Card key={odtType.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <img
                  src={getIsraelImage(odtType.imageKey, 640)}
                  srcSet={getIsraelImageSrcSet(odtType.imageKey, [400, 640, 800])}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt={isHe ? odtType.titleHe : odtType.titleEn}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={384}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{isHe ? odtType.titleHe : odtType.titleEn}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {isHe ? odtType.descriptionHe : odtType.descriptionEn}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
