-- Create contact tracking table for analytics
CREATE TABLE public.contact_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  contact_type TEXT NOT NULL, -- 'whatsapp', 'phone', 'email'
  contact_value TEXT NOT NULL, -- phone number or email
  message_template TEXT, -- pre-filled message if applicable
  source_page TEXT, -- which page/component the contact came from
  user_session TEXT, -- session identifier
  user_agent TEXT, -- browser info
  referrer TEXT -- where user came from
);

-- Enable RLS
ALTER TABLE public.contact_tracking ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert tracking data
CREATE POLICY "Anyone can insert contact tracking"
ON public.contact_tracking
FOR INSERT
WITH CHECK (true);

-- Only admins can view tracking data
CREATE POLICY "Admins can view contact tracking"
ON public.contact_tracking
FOR SELECT
USING (is_admin(auth.uid()));

-- Create index for analytics queries
CREATE INDEX idx_contact_tracking_type ON public.contact_tracking(contact_type);
CREATE INDEX idx_contact_tracking_created ON public.contact_tracking(created_at DESC);
CREATE INDEX idx_contact_tracking_source ON public.contact_tracking(source_page);