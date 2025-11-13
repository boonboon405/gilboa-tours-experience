-- Create categories management table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🎯',
  description TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'from-gray-500 to-gray-400',
  recommendations JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active categories"
  ON public.categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage categories"
  ON public.categories
  FOR ALL
  USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bookings_updated_at();

-- Insert default categories
INSERT INTO public.categories (category_key, name, icon, description, color, display_order, recommendations) VALUES
  ('adventure', 'הרפתקאות ואקסטרים', '🔥', 'פעילויות אדרנלין, אתגרים פיזיים ואקשן', 'from-red-500 to-orange-500', 1, 
   '["רכבי שטח באזור הגלבוע", "ביקור במעיינות סחנה", "קיאקים בנהר", "זיפליין וגשרי חבלים"]'::jsonb),
  
  ('nature', 'טבע, מים ורוגע', '💧', 'חיבור לטבע, מעיינות ושלווה', 'from-blue-500 to-cyan-400', 2,
   '["שחייה בגן השלושה", "מסע לרכס הגלבוע", "הגן היפני בבית אלפא", "צפרות בעמק הירדן"]'::jsonb),
  
  ('history', 'היסטוריה, תרבות ומורשת', '🏛️', 'למידה, אתרים היסטוריים ותרבות', 'from-amber-600 to-orange-500', 3,
   '["סיור בבית שאן הרומית", "בית הכנסת בית אלפא", "סיפור המלך שאול", "מוזיאון עין חרוד"]'::jsonb),
  
  ('culinary', 'קולינריה, יין וטעמים', '🍷', 'חוויות קולינריות, טעימות ואוכל', 'from-purple-600 to-pink-500', 4,
   '["ארוחה במסעדה מזרחית בבית שאן", "טעימת יין ביקב בוטיק", "סדנת שמן זית", "בישול פויקה מסורתי"]'::jsonb),
  
  ('sports', 'ODT ספורט, תחרות וצוותיות', '⚡', 'תחרויות, משחקי צוות ואתגרים ספורטיביים', 'from-green-500 to-emerald-400', 5,
   '["מרוץ קיאקים צוותי", "פיינטבול", "חץ וקשת", "משחקי מים אולימפיים"]'::jsonb),
  
  ('creative', 'יצירה ורוחניות', '🎨', 'אמנות, יצירה והתבוננות', 'from-pink-500 to-purple-400', 6,
   '["מוזיאון אמנות עין חרוד", "תחרות צילום בטבע", "פינת אמנות יצירתית", "מעגל מוזיקה"]'::jsonb),
  
  ('wellness', 'בריאות ופינוק', '🌿', 'רוגע, עיסויים ופינוק', 'from-teal-500 to-green-400', 7,
   '["יוגה במעיינות", "עיסוי מקצועי", "מדיטציה בטבע", "סדנת גוף-נפש"]'::jsonb),
  
  ('teambuilding', 'בניית צוות ומנהיגות', '🤝', 'פעילויות לחיזוק קבוצות, תקשורת וליווי ארגוני', 'from-indigo-500 to-blue-500', 8,
   '["ציד אוצר היסטורי", "אתגר בניית רפסודה", "דיון מנהיגות", "תקשורת ללא מילים"]'::jsonb)
ON CONFLICT (category_key) DO NOTHING;