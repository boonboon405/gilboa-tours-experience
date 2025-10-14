import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ODTSection } from '@/components/ODTSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ODTSection />
      <Footer />
    </div>
  );
};

export default Index;
