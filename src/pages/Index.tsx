import { Navigation } from '@/components/Navigation';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
