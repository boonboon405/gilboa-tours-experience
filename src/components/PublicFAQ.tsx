import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'כמה אנשים יכולים להשתתף בסיור?',
    a: 'אנחנו מתאימים סיורים לקבוצות בכל גודל — מ-10 ועד מאות משתתפים. כל סיור מותאם אישית.',
  },
  {
    q: 'האם הסיורים כוללים הסעות?',
    a: 'ההסעות אינן כלולות במחיר הבסיסי, אך נשמח לסייע בתיאום הסעות בעלויות נוספות.',
  },
  {
    q: 'מה כולל יום גיבוש (ODT)?',
    a: 'יום הגיבוש כולל פעילויות אתגריות בטבע, הנחיית מנחה מקצועי, וארוחות לפי בחירתכם.',
  },
  {
    q: 'באיזה אזורים מתקיימים הסיורים?',
    a: 'הסיורים מתקיימים באזור הגלבוע, עמק המעיינות, בית שאן, הגליל והגולן.',
  },
  {
    q: 'כמה זמן מראש צריך להזמין?',
    a: 'מומלץ להזמין לפחות שבועיים מראש, אך אנחנו תמיד משתדלים למצוא פתרון גם בהתראה קצרה.',
  },
];

export const PublicFAQ = () => {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-foreground">
            שאלות נפוצות
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            לא מצאתם תשובה? צרו איתנו קשר.
          </p>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
