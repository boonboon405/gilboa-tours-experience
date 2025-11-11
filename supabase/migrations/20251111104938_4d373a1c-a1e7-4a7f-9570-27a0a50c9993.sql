-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  template_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(name)
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_company TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  testimonial_text TEXT NOT NULL,
  tour_type TEXT,
  tour_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create email automation sequences table
CREATE TABLE public.email_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  CHECK (trigger_type IN ('lead_created', 'booking_created', 'no_response', 'custom'))
);

-- Create email sequence steps table
CREATE TABLE public.email_sequence_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  delay_hours INTEGER NOT NULL DEFAULT 0,
  template_id UUID REFERENCES public.email_templates(id),
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email queue table for tracking scheduled emails
CREATE TABLE public.email_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  lead_id UUID REFERENCES public.leads(id),
  booking_id UUID REFERENCES public.bookings(id),
  sequence_id UUID REFERENCES public.email_sequences(id),
  step_id UUID REFERENCES public.email_sequence_steps(id),
  CHECK (status IN ('pending', 'sent', 'failed', 'cancelled'))
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_templates
CREATE POLICY "Only admins can manage email templates"
ON public.email_templates
FOR ALL
TO authenticated
USING (is_admin(auth.uid()));

-- RLS Policies for testimonials
CREATE POLICY "Anyone can submit testimonials"
ON public.testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view approved testimonials"
ON public.testimonials
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "Admins can view all testimonials"
ON public.testimonials
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

-- RLS Policies for email_sequences
CREATE POLICY "Admins can manage email sequences"
ON public.email_sequences
FOR ALL
TO authenticated
USING (is_admin(auth.uid()));

-- RLS Policies for email_sequence_steps
CREATE POLICY "Admins can manage sequence steps"
ON public.email_sequence_steps
FOR ALL
TO authenticated
USING (is_admin(auth.uid()));

-- RLS Policies for email_queue
CREATE POLICY "Admins can view email queue"
ON public.email_queue
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Service role can manage email queue"
ON public.email_queue
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Create trigger for updating timestamps
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_knowledge_base_updated_at();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_knowledge_base_updated_at();

CREATE TRIGGER update_email_sequences_updated_at
BEFORE UPDATE ON public.email_sequences
FOR EACH ROW
EXECUTE FUNCTION public.update_knowledge_base_updated_at();

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, template_type, html_content, variables) VALUES
('lead_welcome', 'תודה על פנייתך - דוד טורס', 'lead', 
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>שלום {{customer_name}},</h1>
  <p>תודה שפניתם אלינו! נציגינו ייצרו קשר בקרוב.</p>
</div>', 
'["customer_name"]'::jsonb),

('booking_confirmation', 'אישור הזמנה - דוד טורס', 'booking',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>הזמנתך אושרה!</h1>
  <p>שלום {{customer_name}},</p>
  <p>תאריך הטיול: {{tour_date}}</p>
  <p>מספר משתתפים: {{participants_count}}</p>
</div>',
'["customer_name", "tour_date", "participants_count"]'::jsonb),

('follow_up', 'נשמח לשמוע ממך - דוד טורס', 'follow_up',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>שלום {{customer_name}},</h1>
  <p>שמנו לב שעדיין לא קיבלנו תשובה ממך.</p>
  <p>נשמח לעזור בכל שאלה!</p>
</div>',
'["customer_name"]'::jsonb);

-- Insert default email sequence
INSERT INTO public.email_sequences (name, description, trigger_type, is_active) VALUES
('Lead Follow-up', 'Automatic follow-up for leads with no response', 'no_response', true);

-- Get the sequence ID and insert steps
WITH seq AS (
  SELECT id FROM public.email_sequences WHERE name = 'Lead Follow-up' LIMIT 1
)
INSERT INTO public.email_sequence_steps (sequence_id, step_order, delay_hours, subject, html_content)
SELECT 
  seq.id,
  1,
  48,
  'עדיין מעוניינים? - דוד טורס',
  '<div style="font-family: Arial, sans-serif;"><h2>שלום,</h2><p>האם עדיין מעוניינים בטיול?</p></div>'
FROM seq;