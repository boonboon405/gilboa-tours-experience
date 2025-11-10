-- Create table for quiz analytics
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scores JSONB NOT NULL,
  top_categories TEXT[] NOT NULL,
  percentages JSONB NOT NULL,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert quiz results (public quiz)
CREATE POLICY "Anyone can insert quiz results"
ON public.quiz_results
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view quiz results (for future admin panel)
CREATE POLICY "Authenticated users can view quiz results"
ON public.quiz_results
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create index for faster analytics queries
CREATE INDEX idx_quiz_results_created_at ON public.quiz_results(created_at DESC);
CREATE INDEX idx_quiz_results_top_categories ON public.quiz_results USING GIN(top_categories);

-- Create a public function to get aggregated category statistics
CREATE OR REPLACE FUNCTION public.get_category_stats()
RETURNS TABLE(
  category TEXT,
  appearance_count BIGINT,
  avg_percentage NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    cat as category,
    COUNT(*) as appearance_count,
    ROUND(AVG((percentages->>cat)::numeric), 2) as avg_percentage
  FROM public.quiz_results,
  LATERAL unnest(top_categories) AS cat
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY cat
  ORDER BY appearance_count DESC;
$$;