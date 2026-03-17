import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

export const PublicFAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data, error } = await supabase
          .from('knowledge_base')
          .select('id, question, answer, category')
          .eq('is_active', true)
          .order('priority', { ascending: false })
          .limit(8);
        if (error) throw error;
        setFaqs(data || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  if (loading || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('faq.title')}</h2>
            <p className="text-muted-foreground text-lg">{t('faq.subtitle')}</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 data-[state=open]:bg-muted/30"
              >
                <AccordionTrigger className="text-start font-semibold hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">{t('faq.notFound')}</p>
            <a
              href="#contact"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              {t('faq.contactUs')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
