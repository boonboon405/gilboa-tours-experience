import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ServiceCards } from '@/components/ServiceCards';
import { Testimonials } from '@/components/Testimonials';
import { PublicFAQ } from '@/components/PublicFAQ';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import SEOKeywords from '@/components/SEOKeywords';
import { LiveChatWidget } from '@/components/LiveChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOKeywords />
      <Navigation />
      <Hero />
      <ServiceCards />
      <Testimonials />
      <PublicFAQ />
      <div id="contact" className="scroll-mt-20">
        <ContactSection />
      </div>
      <Footer />
      <LiveChatWidget />
    </div>
  );
};

export default Index;
