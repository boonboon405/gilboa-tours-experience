import { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, useReducedMotion } from 'framer-motion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const PublicFAQ = () => {
  const { language, t } = useLanguage();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data } = await supabase
        .from('knowledge_base')
        .select('id, question, answer')
        .eq('is_active', true)
        .eq('language', language)
        .order('priority', { ascending: false })
        .limit(7);
      if (data && data.length > 0) setFaqs(data);
      setLoading(false);
    };
    fetchFaqs();
  }, [language]);

  const fallback = [1, 2, 3, 4, 5].map((i) => ({
    id: String(i),
    question: t(`faq.${i}.q`),
    answer: t(`faq.${i}.a`),
  }));

  const displayFaqs = faqs.length > 0 ? faqs : (loading ? [] : fallback);

  if (loading) return null;

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('faq.title')}</h2>
            <p className="text-muted-foreground">{t('faq.subtitle')}</p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {displayFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-border rounded-lg px-6 bg-card data-[state=open]:shadow-sm transition-shadow"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-5 text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
