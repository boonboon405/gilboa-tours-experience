import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

export default function SEOKeywords() {
  const [keywords, setKeywords] = useState<string>('');

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_keywords')
          .select('keyword')
          .eq('is_active', true)
          .order('keyword');

        if (error) throw error;

        if (data && data.length > 0) {
          const keywordList = data.map(k => k.keyword).join(', ');
          setKeywords(keywordList);
        }
      } catch (error) {
        console.error('Error fetching SEO keywords:', error);
      }
    };

    fetchKeywords();
  }, []);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "David Gilboa Tours",
    "description": "Guided nature tours, VIP experiences, and corporate team-building days in the Gilboa mountains, Springs Valley, and the Galilee.",
    "url": "https://simcha-tours.lovable.app",
    "telephone": "+972-53-731-4235",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Northern District",
      "addressCountry": "IL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.4965,
      "longitude": 35.4245
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "120",
      "bestRating": "5"
    },
    "priceRange": "$$"
  };

  const touristAttractionSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Gilboa Mountains & Springs Valley",
    "description": "Natural springs, ancient ruins, and breathtaking mountain views in Northern Israel.",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.4965,
      "longitude": 35.4245
    },
    "isAccessibleForFree": false,
    "touristType": ["Nature lovers", "Families", "Corporate groups"]
  };

  return (
    <Helmet>
      {keywords && <meta name="keywords" content={keywords} />}
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(touristAttractionSchema)}</script>
    </Helmet>
  );
}
