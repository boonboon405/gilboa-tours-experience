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

  if (!keywords) return null;

  return (
    <Helmet>
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}
