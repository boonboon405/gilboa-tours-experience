import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const PublicFAQ = () => {
  const { language } = useLanguage();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('knowledge_base')
          .select('id, question, answer')
          .eq('is_active', true)
          .eq('language', language)
          .order('priority', { ascending: false })
          .limit(8);
        if (data) setFaqs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [language]);

  if (loading || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">
            {language === 'he' ? 'שאלות נפוצות' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            {language === 'he' ? 'לא מצאתם תשובה? צרו איתנו קשר.' : "Didn't find an answer? Contact us."}
          </p>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-xl px-6">
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
