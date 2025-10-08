import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Activities } from '@/components/Activities';
import { ODTSection } from '@/components/ODTSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Activities />
      <ODTSection />
      <WhyChooseUs />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
