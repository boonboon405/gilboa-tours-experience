import { useAppSelector } from '@/store/hooks';
import { getLanguage } from '@/store/slices/languageSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const language = useAppSelector(getLanguage);

  const testimonials = [
    {
      name: { he: 'רונית כהן', en: 'Ronit Cohen' },
      company: { he: 'מנהלת משאבי אנוש, חברת הייטק', en: 'HR Manager, Tech Company' },
      text: { 
        he: 'יום מדהים! הצוות שלנו חזר מאוחד ומלא אנרגיה. השילוב של פעילויות גיבוש והיסטוריה היה מושלם. דייויד וצוותו היו מקצועיים ומלאי התלהבות.',
        en: 'Amazing day! Our team came back united and energized. The combination of team-building and history was perfect. David and his team were professional and enthusiastic.'
      },
      rating: 5,
    },
    {
      name: { he: 'יוסי לוי', en: 'Yossi Levi' },
      company: { he: 'מנכ"ל, חברת ייצור', en: 'CEO, Manufacturing Company' },
      text: { 
        he: 'חוויה בלתי נשכחת! הפעילויות היו מגוונות והמדריכים היו מעולים. המקום מושלם לטיול גיבוש והעובדים שלנו כבר שואלים מתי נחזור.',
        en: 'Unforgettable experience! The activities were diverse and the guides were excellent. The place is perfect for team building and our employees are already asking when we\'ll return.'
      },
      rating: 5,
    },
    {
      name: { he: 'מיכל אברהם', en: 'Michal Avraham' },
      company: { he: 'סמנכ"לית שיווק, חברה בינלאומית', en: 'VP Marketing, International Company' },
      text: { 
        he: 'ארגון מושלם מתחילה ועד סוף. תשומת הלב לפרטים, הגמישות בהתאמת התוכנית, והאווירה החמה - הכל היה ברמה הכי גבוהה. ממליצה בחום!',
        en: 'Perfect organization from start to finish. Attention to detail, flexibility in customizing the program, and warm atmosphere - everything was top-notch. Highly recommend!'
      },
      rating: 5,
    },
    {
      name: { he: 'דן שמואל', en: 'Dan Shmuel' },
      company: { he: 'מנהל פיתוח עסקי, סטארטאפ', en: 'Business Development Manager, Startup' },
      text: { 
        he: 'המקום הכי טוב לטיול צוות! השילוב של אתגר, כיף, והיסטוריה יצר חוויה משמעותית. הצוות שלנו מדבר על זה עד היום.',
        en: 'The best place for a team trip! The combination of challenge, fun, and history created a meaningful experience. Our team still talks about it.'
      },
      rating: 5,
    },
    {
      name: { he: 'שרה גולדשטיין', en: 'Sara Goldstein' },
      company: { he: 'מנהלת פרויקטים, חברת ייעוץ', en: 'Project Manager, Consulting Firm' },
      text: { 
        he: 'יום מעולה! הפעילויות היו מאתגרות ומהנות, והצוות של דייויד דאג שכולם ירגישו חלק. החוויה הקולינרית בסוף הייתה דובדבן שבקצפת.',
        en: 'Excellent day! The activities were challenging and fun, and David\'s team made sure everyone felt included. The culinary experience at the end was the cherry on top.'
      },
      rating: 5,
    },
    {
      name: { he: 'אלון ברק', en: 'Alon Barak' },
      company: { he: 'מנהל מכירות, חברת מסחר', en: 'Sales Manager, Trading Company' },
      text: { 
        he: 'חוויה מדהימה! הצוות שלנו נהנה מכל רגע. המקום מרהיב, הפעילויות מגוונות, והארגון היה מושלם. בהחלט נחזור!',
        en: 'Amazing experience! Our team enjoyed every moment. The location is stunning, activities diverse, and organization was perfect. We\'ll definitely return!'
      },
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {language === 'he' ? 'מה הלקוחות שלנו אומרים' : 'What Our Clients Say'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'he' 
              ? 'אלפי חברות סומכות עלינו ליצירת חוויות בלתי נשכחות' 
              : 'Thousands of companies trust us to create unforgettable experiences'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
              <CardContent className="p-6 relative">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text[language]}"
                </p>

                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">
                    {testimonial.name[language]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.company[language]}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Testimonials };
