import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { TourServices } from '@/components/TourServices';
import { ChooseYourDay } from '@/components/ChooseYourDay';
import { VIPTours } from '@/components/VIPTours';
import { ODTSection } from '@/components/ODTSection';
import { Testimonials } from '@/components/Testimonials';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { LayoutSelector } from '@/components/LayoutSelector';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  const handleLayoutSelection = (layoutId: number) => {
    toast({
      title: `בחרת פריסה ${layoutId}`,
      description: "אנא שלח לי את מספר הפריסה בצ'אט כדי שאוכל ליישם אותה",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <LayoutSelector onSelect={handleLayoutSelection} />
      <TourServices />
      
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
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
