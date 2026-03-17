import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { ServiceCards } from '@/components/ServiceCards';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { ChooseYourDay } from '@/components/ChooseYourDay';
import { VIPTours } from '@/components/VIPTours';
import { ODTSection } from '@/components/ODTSection';
import { LandscapeGallery } from '@/components/LandscapeGallery';
import { WhatToBring } from '@/components/WhatToBring';
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
      <WhyChooseUs />
      <ServiceCards />
      <CategoryShowcase />
      <ChooseYourDay />
      <VIPTours />
      <ODTSection />
      <LandscapeGallery />
      <WhatToBring />
      <Testimonials />
      <PublicFAQ />
      <ContactSection />
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default Index;
