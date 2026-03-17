import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Backpack, Sun, Droplets, Footprints, Camera, Shirt, Glasses, Sandwich, Snowflake } from 'lucide-react';

const WhatToBring = () => {
  const { language } = useLanguage();

  const items = [
    {
      icon: Droplets,
      title: { he: 'בקבוקי מים', en: 'Water Bottles' },
      description: { he: 'חשוב להישאר מיובשים לאורך היום', en: 'Stay hydrated throughout the day' },
      color: 'from-primary/20 to-primary/10',
    },
    {
      icon: Sun,
      title: { he: 'הגנה מהשמש', en: 'Sun Protection' },
      description: { he: 'כובע וקרם הגנה', en: 'Hat and sunscreen' },
      color: 'from-secondary/20 to-accent/20',
    },
    {
      icon: Glasses,
      title: { he: 'משקפי שמש', en: 'Sunglasses' },
      description: { he: 'הגנה על העיניים מקרני השמש', en: 'Protect your eyes from sun rays' },
      color: 'from-accent/20 to-secondary/20',
    },
    {
      icon: Footprints,
      title: { he: 'נעליים נוחות', en: 'Comfortable Shoes' },
      description: { he: 'מתאימות להליכה ופעילות', en: 'Suitable for walking and activities' },
      color: 'from-primary/20 to-primary/10',
    },
    {
      icon: Backpack,
      title: { he: 'תיק גב קל', en: 'Light Backpack' },
      description: { he: 'לנשיאת הציוד האישי', en: 'For carrying personal items' },
      color: 'from-primary/15 to-primary/5',
    },
    {
      icon: Shirt,
      title: { he: 'בגד ים/מגבת', en: 'Swimsuit/Towel' },
      description: { he: 'לפעילויות מים', en: 'For water activities' },
      color: 'from-primary/20 to-accent/10',
    },
    {
      icon: Camera,
      title: { he: 'מצלמה/טלפון', en: 'Camera/Phone' },
      description: { he: 'לתיעוד הרגעים המיוחדים', en: 'Capture special moments' },
      color: 'from-secondary/20 to-secondary/10',
    },
    {
      icon: Sandwich,
      title: { he: 'חטיפים', en: 'Snacks' },
      description: { he: 'לאנרגיה בין הפעילויות', en: 'Energy between activities' },
      color: 'from-accent/20 to-accent/10',
    },
    {
      icon: Snowflake,
      title: { he: 'ג\'קט קל', en: 'Light Jacket' },
      description: { he: 'לערבים קרירים', en: 'For cool evenings' },
      color: 'from-primary/10 to-muted',
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {language === 'he' ? 'מה להביא?' : 'What to Bring?'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'he' 
              ? 'רשימת פריטים מומלצים ליום הטיול המושלם שלכם' 
              : 'Recommended items for your perfect day trip'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {item.title[language]}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description[language]}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { WhatToBring };
