-- Create table for SEO keywords
CREATE TABLE public.seo_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read keywords (needed for public page)
CREATE POLICY "Anyone can view active keywords" 
ON public.seo_keywords 
FOR SELECT 
USING (is_active = true);

-- Allow anyone to insert keywords (you can restrict this later if needed)
CREATE POLICY "Anyone can insert keywords" 
ON public.seo_keywords 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update keywords
CREATE POLICY "Anyone can update keywords" 
ON public.seo_keywords 
FOR UPDATE 
USING (true);

-- Allow anyone to delete keywords
CREATE POLICY "Anyone can delete keywords" 
ON public.seo_keywords 
FOR DELETE 
USING (true);

-- Insert existing keywords
INSERT INTO public.seo_keywords (keyword, category) VALUES
('יום כיף', 'team-building'),
('ימי כיף', 'team-building'),
('ימי חברה', 'team-building'),
('יום חברה', 'team-building'),
('פעילות גיבוש', 'team-building'),
('פעילויות גיבוש', 'team-building'),
('יום צוות', 'team-building'),
('ימי צוות', 'team-building'),
('ימי עובדים', 'employees'),
('יום לעובדים', 'employees'),
('נופש חברה', 'vacation'),
('ימי נופש', 'vacation'),
('יום נופש', 'vacation'),
('פעילות לעובדים', 'employees'),
('פעילויות לעובדים', 'employees'),
('יום חוויתי', 'experience'),
('ימי חוויה', 'experience'),
('חוויות לעובדים', 'experience'),
('יום שטח', 'outdoor'),
('טיול חברה', 'tours'),
('טיול צוות', 'tours'),
('טיול לעובדים', 'tours'),
('יום בטבע', 'nature'),
('סיור לעובדים', 'tours'),
('סיור חברה', 'tours'),
('סיור גיבוש', 'tours'),
('ימי סדנאות', 'workshops'),
('יום סדנה', 'workshops'),
('סדנת גיבוש', 'workshops'),
('סדנאות לעובדים', 'workshops'),
('יום השראה', 'inspiration'),
('ימי השראה', 'inspiration'),
('ימי למידה', 'learning'),
('יום למידה', 'learning'),
('יום העשרה', 'enrichment'),
('ימי העשרה', 'enrichment'),
('יום חיזוק צוות', 'team-building'),
('פעילות חוץ לעובדים', 'outdoor'),
('אטרקציות לעובדים', 'attractions'),
('יום טיול מאורגן', 'tours'),
('ימי שטח', 'outdoor'),
('פעילות בטבע', 'nature'),
('גיבוש עובדים', 'team-building'),
('ימי ODT', 'odt'),
('פעילות ODT', 'odt'),
('אטרקציות לחברות', 'attractions'),
('יום חוויה בטבע', 'nature'),
('חופשה לעובדים', 'vacation'),
('ימי בונוס לעובדים', 'employees'),
('יום ספורט לעובדים', 'sports'),
('יום התנדבות לעובדים', 'volunteering'),
('יום גיבוש בצפון', 'location'),
('יום גיבוש בדרום', 'location'),
('יום גיבוש בירושלים', 'location'),
('יום גיבוש במרכז', 'location'),
('טיול מאורגן לעובדים', 'tours'),
('חוויה קבוצתית', 'experience'),
('חוויה מאחדת', 'experience'),
('נופשון לעובדים', 'vacation'),
('יום כיף לקבוצות', 'team-building'),
('יום כיף בצפון', 'location'),
('יום כיף בדרום', 'location'),
('יום כיף במרכז', 'location'),
('פעילות לקבוצות', 'team-building'),
('פעילות למנהלים', 'management'),
('פעילות לחברות', 'corporate'),
('סיור קולינרי לעובדים', 'culinary'),
('סיור יין', 'culinary'),
('סיור בעקבות התנך', 'cultural'),
('סיור טבע ונוף', 'nature'),
('טיול אתגרי', 'adventure'),
('טיול ג''יפים לעובדים', 'adventure'),
('סדנת שטח', 'workshops'),
('ימי חוויה לעובדים', 'experience'),
('ימי גיבוש מנהלים', 'management'),
('ימי צוות למנהלים', 'management'),
('פעילות משרדית', 'office'),
('פעילות אחר הצהריים לעובדים', 'employees'),
('ערב גיבוש', 'team-building'),
('ערבי צוות', 'team-building'),
('ערב חברה', 'corporate'),
('מסיבת חברה', 'corporate'),
('אירוע חברה', 'corporate'),
('ימי ODT בטבע', 'odt'),
('סדנת בישול לעובדים', 'workshops'),
('סדנת יצירה', 'workshops'),
('סדנת תקשורת', 'workshops'),
('סדנת הנהגה', 'workshops'),
('סדנת מודעות עצמית', 'workshops'),
('סדנת מנהיגות', 'workshops'),
('יום צוות בחיק הטבע', 'nature'),
('יום הרפתקה לעובדים', 'adventure'),
('טיול מאתגר', 'adventure'),
('מסלול טיול לעובדים', 'tours'),
('מסלול גיבוש', 'team-building'),
('חוויה מאתגרת', 'experience'),
('הפעלות לעובדים', 'employees'),
('הפעלות גיבוש', 'team-building'),
('פעילות קבוצתית', 'team-building'),
('פעילות אקטיבית לעובדים', 'employees'),
('טיולי גלבוע', 'location'),
('Gilboa tours', 'english'),
('team building', 'english'),
('corporate tours Israel', 'english')
ON CONFLICT (keyword) DO NOTHING;