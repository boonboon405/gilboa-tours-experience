import { useAppSelector } from '@/store/hooks';
import { getLanguage } from '@/store/slices/languageSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Backpack, Sun, Droplets, Footprints, Camera, Shirt, Glasses, Sandwich, Snowflake } from 'lucide-react';

const WhatToBring = () => {
  const language = useAppSelector(getLanguage);

  const items = [
    {
      icon: Droplets,
      title: { he: 'בקבוקי מים', en: 'Water Bottles' },
      description: { he: 'חשוב להישאר מיובשים לאורך היום', en: 'Stay hydrated throughout the day' },
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: Sun,
      title: { he: 'הגנה מהשמש', en: 'Sun Protection' },
      description: { he: 'כובע וקרם הגנה', en: 'Hat and sunscreen' },
      color: 'from-orange-500/20 to-yellow-500/20',
    },
    {
      icon: Glasses,
      title: { he: 'משקפי שמש', en: 'Sunglasses' },
      description: { he: 'הגנה על העיניים מקרני השמש', en: 'Protect your eyes from sun rays' },
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: Footprints,
      title: { he: 'נעליים נוחות', en: 'Comfortable Shoes' },
      description: { he: 'מתאימות להליכה ופעילות', en: 'Suitable for walking and activities' },
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: Backpack,
      title: { he: 'תיק גב קל', en: 'Light Backpack' },
      description: { he: 'לנשיאת הציוד האישי', en: 'For carrying personal items' },
      color: 'from-indigo-500/20 to-blue-500/20',
    },
    {
      icon: Shirt,
      title: { he: 'בגד ים/מגבת', en: 'Swimsuit/Towel' },
      description: { he: 'לפעילויות מים', en: 'For water activities' },
      color: 'from-teal-500/20 to-cyan-500/20',
    },
    {
      icon: Camera,
      title: { he: 'מצלמה/טלפון', en: 'Camera/Phone' },
      description: { he: 'לתיעוד הרגעים המיוחדים', en: 'Capture special moments' },
      color: 'from-rose-500/20 to-red-500/20',
    },
    {
      icon: Sandwich,
      title: { he: 'חטיפים', en: 'Snacks' },
      description: { he: 'לאנרגיה בין הפעילויות', en: 'Energy between activities' },
      color: 'from-amber-500/20 to-orange-500/20',
    },
    {
      icon: Snowflake,
      title: { he: 'ג\'קט קל', en: 'Light Jacket' },
      description: { he: 'לערבים קרירים', en: 'For cool evenings' },
      color: 'from-sky-500/20 to-blue-500/20',
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
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
