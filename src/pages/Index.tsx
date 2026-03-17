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
import { motion } from 'framer-motion';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const ScrollReveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={reveal}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
  >
    {children}
  </motion.div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ScrollReveal><WhyChooseUs /></ScrollReveal>
      <ScrollReveal><ServiceCards /></ScrollReveal>
      <ScrollReveal><CategoryShowcase /></ScrollReveal>
      <ScrollReveal><ChooseYourDay /></ScrollReveal>
      <ScrollReveal><VIPTours /></ScrollReveal>
      <ScrollReveal><ODTSection /></ScrollReveal>
      <ScrollReveal><LandscapeGallery /></ScrollReveal>
      <ScrollReveal><WhatToBring /></ScrollReveal>
      <ScrollReveal><Testimonials /></ScrollReveal>
      <ScrollReveal><PublicFAQ /></ScrollReveal>
      <ScrollReveal><ContactSection /></ScrollReveal>
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default Index;
