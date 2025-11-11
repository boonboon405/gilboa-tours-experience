-- Create knowledge base table for Q&A pairs
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  keywords TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policies for knowledge base
CREATE POLICY "Anyone can view active knowledge base entries"
  ON public.knowledge_base
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can insert knowledge base entries"
  ON public.knowledge_base
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update knowledge base entries"
  ON public.knowledge_base
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete knowledge base entries"
  ON public.knowledge_base
  FOR DELETE
  USING (true);

-- Create index for better search performance
CREATE INDEX idx_knowledge_base_keywords ON public.knowledge_base USING GIN(keywords);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_base_active ON public.knowledge_base(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_knowledge_base_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_knowledge_base_updated_at
BEFORE UPDATE ON public.knowledge_base
FOR EACH ROW
EXECUTE FUNCTION public.update_knowledge_base_updated_at();

-- Insert initial knowledge base entries
INSERT INTO public.knowledge_base (question, answer, category, keywords, priority) VALUES
('מה אתם מציעים?', 'אנחנו מציעים למעלה מ-100 פעילויות שונות באזור נחל המעינות, הר גלבוע, הגליל וסובב כנרת. הפעילויות כוללים: סיורי שטח ברכבי מועדון, ביקור במעיינות סחנה, סיור בבית שאן העתיקה, חוויות קולינריות בכפר נחלל, רפטינג בירדן, סדנאות יצירה, יוגה בטבע ועוד הרבה אפשרויות.', 'general', ARRAY['מה', 'מציעים', 'פעילויות', 'אפשרויות'], 100),
('כמה עולה?', 'המחיר משתנה בהתאם לסוג הפעילות, מספר המשתתפים ומשך הסיור. נשמח לתת הצעת מחיר מותאמת אישית לפי הצרכים שלכם. נוכל לדבר על זה? בואו נבין קודם מה מעניין אתכם.', 'pricing', ARRAY['מחיר', 'עולה', 'כמה', 'עלות'], 90),
('איפה אתם ממוקמים?', 'אנחנו פועלים בכל אזור צפון ישראל, במיוחד באזור נחל המעינות, הר גלבוע, הגליל וסובב כנרת. הסיורים שלנו יוצאים מנקודות שונות בהתאם לפעילות שתבחרו.', 'location', ARRAY['איפה', 'מיקום', 'ממוקמים', 'אזור'], 85),
('כמה זמן נמשך סיור?', 'זה תלוי בסוג הסיור שתבחרו. יש לנו אפשרויות של חצי יום (4-5 שעות), יום מלא (8-10 שעות), ואפילו סיורים של מספר ימים. נוכל להתאים בדיוק לזמן שיש לכם.', 'duration', ARRAY['זמן', 'נמשך', 'כמה זמן', 'משך'], 80);
