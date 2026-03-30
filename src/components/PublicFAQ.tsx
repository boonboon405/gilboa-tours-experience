import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

export const PublicFAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('id, question, answer, category')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .limit(10);

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">טוען שאלות נפוצות...</p>
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  // Group FAQs by category
  const categories = Array.from(new Set(faqs.map(faq => faq.category || 'כללי')));

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-4">שאלות נפוצות</h2>
            <p className="text-muted-foreground text-lg">
              מצא תשובות לשאלות הנפוצות ביותר
            </p>
          </div>

          <div className="space-y-8">
            {categories.map(category => {
              const categoryFaqs = faqs.filter(faq => (faq.category || 'כללי') === category);
              
              return (
                <Card key={category} className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-primary">{category}</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {categoryFaqs.map((faq, index) => (
                      <AccordionItem key={faq.id} value={`item-${index}`}>
                        <AccordionTrigger className="text-right text-lg font-semibold hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-right text-muted-foreground whitespace-pre-wrap">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">לא מצאת את התשובה שחיפשת?</p>
            <a 
              href="#contact" 
              className="inline-block px-6 py-3 bg-gradient-hero text-white font-semibold rounded-lg hover:opacity-90 transition-all hover:scale-105 shadow-glow"
            >
              צור קשר איתנו
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
