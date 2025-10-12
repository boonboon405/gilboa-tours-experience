import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ChooseYourDay } from '@/components/ChooseYourDay';
import { ODTSection } from '@/components/ODTSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
import { WhatToBring } from '@/components/WhatToBring';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ChooseYourDay />
      <ODTSection />
      <WhyChooseUs />
      <Testimonials />
      <WhatToBring />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
