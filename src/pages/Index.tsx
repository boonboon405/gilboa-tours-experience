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
import { TestimonialSubmissionForm } from '@/components/TestimonialSubmissionForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOKeywords />
      <ExitIntentModal />
      <EmergencyContactButton />
      <Navigation />
      <div id="home">
        <Hero />
      </div>
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
      <div id="testimonial-form" className="scroll-mt-20 py-20 bg-background">
        <div className="container mx-auto px-4">
          <TestimonialSubmissionForm />
        </div>
      </div>
      <div id="contact" className="scroll-mt-20">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
