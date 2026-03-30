import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, MapPin, Users, Star, Shield, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AnimatedCounter = ({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const stats = (isHe: boolean) => [
  { icon: MapPin, value: 500, suffix: '+', label: isHe ? 'סיורים הושלמו' : 'Tours Completed' },
  { icon: Users, value: 12000, suffix: '+', label: isHe ? 'משתתפים מרוצים' : 'Happy Participants' },
  { icon: Star, value: 15, suffix: '+', label: isHe ? 'שנות ניסיון' : 'Years of Experience' },
  { icon: Award, value: 100, suffix: '%', label: isHe ? 'שביעות רצון' : 'Satisfaction Rate' },
];

const credentials = (isHe: boolean) => [
  { icon: Shield, text: isHe ? 'מדריך טיולים מוסמך — משרד התיירות' : 'Licensed Tour Guide — Ministry of Tourism' },
  { icon: Award, text: isHe ? 'מנחה ODT מוסמך לפעילויות גיבוש' : 'Certified ODT Facilitator for Team-Building' },
  { icon: Heart, text: isHe ? 'מומחה לאזור הגלבוע, עמק המעיינות והגליל' : 'Specialist in the Gilboa, Springs Valley & Galilee' },
];

export const AboutDavid = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden"
    >
      {/* Decorative blur */}
      <div className="absolute top-20 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading mb-4">
            {isHe ? 'הכירו את דויד' : 'Meet David'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-[1.7]">
            {isHe
              ? 'מדריך טיולים מקצועי ומנוסה עם אהבה עמוקה לארץ ישראל ולאנשים'
              : 'A professional, experienced tour guide with a deep love for the Land of Israel and its people'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto items-start">
          {/* Bio column — 3 cols */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: isHe ? 40 : -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg">
                {isHe ? 'ד' : 'D'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {isHe ? 'דויד דניאל רחימי' : 'David Daniel Rahimi'}
                </h3>
                <p className="text-primary font-medium">
                  {isHe ? 'מייסד ומדריך ראשי — דויד טורס' : 'Founder & Lead Guide — David Tours'}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-[1.8] text-base">
              {isHe
                ? 'דויד הוא מדריך טיולים מוסמך עם למעלה מ-15 שנות ניסיון בהדרכת קבוצות, חברות, ומשפחות ברחבי הגלבוע, עמק המעיינות והגליל. הוא מתמחה ביצירת חוויות בלתי נשכחות המשלבות טבע, היסטוריה, הרפתקאות וגיבוש צוותי.'
                : 'David is a licensed tour guide with over 15 years of experience leading groups, companies, and families across the Gilboa, Springs Valley, and the Galilee. He specializes in creating unforgettable experiences that blend nature, history, adventure, and team-building.'}
            </p>
            <p className="text-muted-foreground leading-[1.8] text-base">
              {isHe
                ? 'עם ידע מעמיק באזור, תשוקה אמיתית לטבע הארץ, ויכולת התאמה אישית לכל קבוצה — דויד מביא לכל סיור גישה מקצועית, חמה ואישית. מסיורים יומיים ועד חוויות VIP פרטיות — כל יום עם דויד הוא יום שלא תשכחו.'
                : 'With deep local knowledge, a genuine passion for the land, and the ability to personalize every experience — David brings a professional, warm, and personal approach to every tour. From daily guided tours to private VIP experiences — every day with David is one you won\'t forget.'}
            </p>

            {/* Credentials */}
            <div className="space-y-3 pt-4">
              {credentials(isHe).map((cred, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: isHe ? 20 : -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <cred.icon className="h-5 w-5" />
                  </div>
                  <span className="text-foreground font-medium text-sm">{cred.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats column — 2 cols */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: isHe ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {stats(isHe).map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    className="p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/30 transition-colors text-center shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Icon className="h-7 w-7 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-foreground mb-1">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust badge */}
            <motion.div
              className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p className="text-foreground font-semibold text-lg mb-1">
                {isHe ? '⭐ דירוג 4.9/5' : '⭐ Rated 4.9/5'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isHe ? 'על ידי מאות לקוחות מרוצים' : 'By hundreds of satisfied clients'}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
