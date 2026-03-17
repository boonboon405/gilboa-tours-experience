import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ServiceCards } from '@/components/ServiceCards';
import { Testimonials } from '@/components/Testimonials';
import { PublicFAQ } from '@/components/PublicFAQ';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { AIChatWidget } from '@/components/AIChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ServiceCards />
      <Testimonials />
      <PublicFAQ />
      <ContactSection />
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default Index;
