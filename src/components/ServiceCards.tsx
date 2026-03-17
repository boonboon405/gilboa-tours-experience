import { useState } from 'react';
import { Users, Crown, Mountain, X, MessageCircle, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
};

export const ServiceCards = () => {
  const { t } = useLanguage();
  const [openService, setOpenService] = useState<string | null>(null);

  const services = [
    { key: 'daily', icon: Users },
    { key: 'vip', icon: Crown },
    { key: 'odt', icon: Mountain },
  ];

  const activeService = services.find((s) => s.key === openService);

  return (
    <>
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('services.title')}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">{t('services.subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((s, i) => (
              <motion.div
                key={s.key}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
              >
                <Card
                  className="border-border bg-card hover:shadow-md transition-shadow cursor-pointer h-full"
                  onClick={() => setOpenService(s.key)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <s.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t(`services.${s.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {t(`services.${s.key}.desc`)}
                    </p>
                    <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/5">
                      {t('services.cta')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={!!openService} onOpenChange={() => setOpenService(null)}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border">
          {activeService && (
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <activeService.icon className="h-6 w-6 text-primary" />
                </div>
                <button onClick={() => setOpenService(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3">
                {t(`services.${openService}.title`)}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {t(`services.${openService}.detail`)}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {t(`services.${openService}.highlights`).split(' • ').map((h) => (
                  <span key={h} className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted text-foreground px-3 py-1.5 rounded-full">
                    <Check className="h-3 w-3 text-primary" />
                    {h}
                  </span>
                ))}
              </div>

              <a
                href="https://wa.me/972537314235?text=Hi%20Simcha%2C%20I'd%20like%20more%20info"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <MessageCircle className="h-5 w-5" />
                  {t('services.detail.cta')}
                </Button>
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
