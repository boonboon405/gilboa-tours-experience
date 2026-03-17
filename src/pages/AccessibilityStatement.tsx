import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accessibility, Phone, Mail, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AccessibilityStatement = () => {
  const { t } = useLanguage();
  const lastUpdated = '08/12/2025';

  const features = Array.from({ length: 12 }, (_, i) => t(`a11yStatement.feature${i + 1}`));
  const limitations = Array.from({ length: 3 }, (_, i) => t(`a11yStatement.limitation${i + 1}`));

  return (
    <>
      <Helmet>
        <title>{t('a11yStatement.metaTitle')}</title>
        <meta name="description" content={t('a11yStatement.metaDesc')} />
      </Helmet>

      <Navigation />

      <main id="main-content" className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Accessibility className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{t('a11yStatement.title')}</h1>
            <p className="text-lg text-muted-foreground">{t('a11yStatement.subtitle')}</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle>{t('a11yStatement.commitmentTitle')}</CardTitle></CardHeader>
              <CardContent className="prose prose-lg max-w-none text-foreground space-y-4">
                <p>{t('a11yStatement.commitmentP1')}</p>
                <p>{t('a11yStatement.commitmentP2')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t('a11yStatement.featuresTitle')}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3 text-foreground">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t('a11yStatement.menuTitle')}</CardTitle></CardHeader>
              <CardContent className="prose prose-lg max-w-none text-foreground space-y-4">
                <p>{t('a11yStatement.menuP1')}</p>
                <p>{t('a11yStatement.menuP2')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t('a11yStatement.limitationsTitle')}</CardTitle></CardHeader>
              <CardContent className="prose prose-lg max-w-none text-foreground">
                <p>{t('a11yStatement.limitationsP')}</p>
                <ul className="mt-4 space-y-2">
                  {limitations.map((limitation, i) => (
                    <li key={i}>{limitation}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t('a11yStatement.contactTitle')}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-foreground mb-6">{t('a11yStatement.contactP')}</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href="tel:+972537314235" className="text-primary hover:underline">053-731-4235</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:DavidIsraelTours@gmail.com" className="text-primary hover:underline">DavidIsraelTours@gmail.com</a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('a11yStatement.lastUpdate')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  {t('a11yStatement.lastUpdateText')} <strong>{lastUpdated}</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AccessibilityStatement;
