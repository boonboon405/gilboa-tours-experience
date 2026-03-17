import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ServiceCards } from '@/components/ServiceCards';
import { Testimonials } from '@/components/Testimonials';
import { PublicFAQ } from '@/components/PublicFAQ';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import SEOKeywords from '@/components/SEOKeywords';
import { LiveChatWidget } from '@/components/LiveChatWidget';
import { ScrollReveal } from '@/components/ScrollReveal';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOKeywords />
      <Navigation />
      <Hero />
      <ScrollReveal>
        <ServiceCards />
      </ScrollReveal>
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal>
        <PublicFAQ />
      </ScrollReveal>
      <ScrollReveal>
        <div id="contact" className="scroll-mt-20">
          <ContactSection />
        </div>
      </ScrollReveal>
      <Footer />
      <LiveChatWidget />
    </div>
  );
};

export default Index;
