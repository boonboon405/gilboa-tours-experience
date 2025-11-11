import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ServiceCards } from '@/components/ServiceCards';
import { ChooseYourDay } from '@/components/ChooseYourDay';
import { VIPTours } from '@/components/VIPTours';
import { ODTSection } from '@/components/ODTSection';
import { Testimonials } from '@/components/Testimonials';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import SEOKeywords from '@/components/SEOKeywords';
import { ExitIntentModal } from '@/components/ExitIntentModal';
import { EmergencyContactButton } from '@/components/EmergencyContactButton';
import { PublicFAQ } from '@/components/PublicFAQ';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOKeywords />
      <ExitIntentModal />
      <EmergencyContactButton />
      <Navigation />
      <Hero />
      <ServiceCards />
      
      {/* Hidden sections - accessed via TourServices CTAs */}
      <div id="choose-your-day" className="scroll-mt-20">
        <ChooseYourDay />
      </div>
      <div id="vip-tours" className="scroll-mt-20">
        <VIPTours />
      </div>
      <div id="odt-section" className="scroll-mt-20">
        <ODTSection />
      </div>
      
      <Testimonials />
      <PublicFAQ />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
