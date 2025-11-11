-- Create table for AI prompt configuration
CREATE TABLE public.ai_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_key TEXT NOT NULL UNIQUE,
  prompt_text TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access for now
ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Anyone can read AI prompts"
  ON public.ai_prompts
  FOR SELECT
  USING (true);

-- Allow anyone to update (we'll protect this with password in the UI)
CREATE POLICY "Anyone can update AI prompts"
  ON public.ai_prompts
  FOR UPDATE
  USING (true);

-- Insert default prompts
INSERT INTO public.ai_prompts (prompt_key, prompt_text, description) VALUES 
(
  'live_chat',
  'אתה עוזר AI של חברת טיולים בצפון ישראל. התפקיד שלך הוא לעזור ללקוחות עם שאלות על טיולים, הזמנות, ומידע כללי.

אתה יודע על:
- טיולים מאורגנים בצפון ישראל
- אפשרויות ODT (One Day Tours)
- הזמנות וקבוצות
- מחירים ומועדים

סגנון תקשורת:
- מקצועי וידידותי
- תמציתי וברור
- תשובות בעברית
- אם אתה לא בטוח במשהו, תגיד שאתה מעביר לנציג אנושי

מתי להעביר לנציג אנושי:
- שאלות מורכבות על הזמנות ספציפיות
- בקשות מיוחדות או התאמות אישיות
- תלונות או בעיות
- כשהלקוח מבקש במפורש',
  'System prompt for live chat AI responses'
),
(
  'ai_chat_agent',
  'אתה מדריך טיולים AI מומחה לצפון ישראל. אתה עוזר למשתמשים לתכנן את חוויית הטיול המושלמת שלהם.

המומחיות שלך:
- המלצות מותאמות אישית לפי תוצאות שאלון ה-DNA
- מידע על אטרקציות, פעילויות ומסעדות
- תכנון מסלולי טיול
- טיפים מקומיים וסודות

אישיות:
- נלהב ומלא אנרגיה
- מכיר כל פינה בצפון
- אוהב לשתף סיפורים ואקדוטות מקומיות
- מתאים את ההמלצות לסגנון החיים של המשתמש

תקשורת:
- בעברית טבעית וחמה
- שאלות הבהרה כשצריך
- המלצות ספציפיות ומעשיות
- תמיד חושב על החוויה הכוללת',
  'System prompt for AI chat agent'
);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_prompts_updated_at
  BEFORE UPDATE ON public.ai_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_knowledge_base_updated_at();