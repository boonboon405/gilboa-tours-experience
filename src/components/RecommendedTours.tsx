import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, DollarSign, Star } from 'lucide-react';
import { ConversationData } from './AnswerSummary';

interface Tour {
  id: string;
  title: string;
  description: string;
  duration: string;
  priceRange: string;
  maxParticipants: number;
  highlights: string[];
  categories: string[];
  rating: number;
}

interface RecommendedToursProps {
  conversationData: ConversationData;
  onSelectTour?: (tour: Tour) => void;
}

export const RecommendedTours = ({ conversationData, onSelectTour }: RecommendedToursProps) => {
  // Generate tours based on conversation data
  const generateRecommendedTours = (): Tour[] => {
    const categories = conversationData.categories || [];
    const numberOfPeople = conversationData.numberOfPeople || 20;
    
    const allTours: Tour[] = [
      {
        id: '1',
        title: 'חבילת הגלבוע המלאה',
        description: 'יום מלא של הרפתקאות - רכבי שטח, מעיינות, בית שאן העתיקה וארוחה מקומית',
        duration: 'יום מלא (8-9 שעות)',
        priceRange: '₪350-450 לאדם',
        maxParticipants: 50,
        highlights: ['רכבי שטח בגלבוע', 'שחייה בסחנה', 'סיור בית שאן', 'ארוחה כשרה'],
        categories: ['adventure', 'nature', 'history', 'culinary'],
        rating: 4.9
      },
      {
        id: '2',
        title: 'ODT חוויית טבע ופעילות',
        description: 'משלב פעילות ספורט, אתגרי צוות במים ופעילויות ODT באזור המעיינות',
        duration: 'חצי יום (4-5 שעות)',
        priceRange: '₪250-350 לאדם',
        maxParticipants: 40,
        highlights: ['פעילויות ODT', 'אתגרים במים', 'פיינטבול', 'משחקי צוות'],
        categories: ['sports', 'adventure', 'nature'],
        rating: 4.8
      },
      {
        id: '3',
        title: 'מסע קולינרי בעמק',
        description: 'טעימות יין, שמן זית, ביקור בחוות גבינות וארוחה במסעדה מקומית',
        duration: 'חצי יום (5-6 שעות)',
        priceRange: '₪300-400 לאדם',
        maxParticipants: 35,
        highlights: ['טעימת יין', 'סדנת שמן זית', 'חוות גבינות', 'ארוחה מזרחית'],
        categories: ['culinary', 'nature', 'wellness'],
        rating: 4.7
      },
      {
        id: '4',
        title: 'טיול תרבות והיסטוריה',
        description: 'מסע בעקבות המקרא - בית שאן, הגלבוע, מוזיאונים ואתרים היסטוריים',
        duration: 'יום מלא (7-8 שעות)',
        priceRange: '₪280-380 לאדם',
        maxParticipants: 60,
        highlights: ['בית שאן הרומי', 'בית אלפא', 'תצפית הגלבוע', 'מוזיאון'],
        categories: ['history', 'creative', 'nature'],
        rating: 4.6
      },
      {
        id: '5',
        title: 'יום רוגע ופינוק',
        description: 'יוגה במעיינות, עיסויים, מדיטציה וארוחה בריאה בטבע',
        duration: 'יום מלא (6-7 שעות)',
        priceRange: '₪320-420 לאדם',
        maxParticipants: 25,
        highlights: ['יוגה בטבע', 'עיסויים', 'מדיטציה', 'ארוחה בריאה'],
        categories: ['wellness', 'nature', 'creative'],
        rating: 4.8
      }
    ];

    // Sort tours by relevance to user's categories
    return allTours.sort((a, b) => {
      const aScore = a.categories.filter(cat => categories.includes(cat)).length;
      const bScore = b.categories.filter(cat => categories.includes(cat)).length;
      return bScore - aScore;
    }).slice(0, 3); // Return top 3
  };

  const tours = generateRecommendedTours();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          🎯 החבילות המומלצות עבורכם
        </h3>
        <p className="text-muted-foreground">
          בחרנו עבורכם את החבילות המתאימות ביותר על בסיס העדפותיכם
        </p>
      </div>

      <div className="grid gap-4">
        {tours.map((tour, index) => (
          <Card key={tour.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {index === 0 && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      ⭐ המומלצת ביותר
                    </Badge>
                  )}
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">{tour.title}</h4>
                <p className="text-muted-foreground mb-4">{tour.description}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{tour.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>{tour.priceRange}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>עד {tour.maxParticipants} משתתפים</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>אזור הגלבוע</span>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-semibold mb-2">נקודות עיקריות:</h5>
              <div className="flex flex-wrap gap-2">
                {tour.highlights.map((highlight, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    ✓ {highlight}
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => onSelectTour?.(tour)}
            >
              בחר חבילה זו
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-muted/50 border-dashed">
        <p className="text-sm text-center text-muted-foreground">
          💡 רוצים לשנות משהו? תגידו לנו ונתאים את החבילות במיוחד עבורכם!
        </p>
      </Card>
    </div>
  );
};
