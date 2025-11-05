-- Create enum for source platforms
CREATE TYPE public.lead_source AS ENUM ('instagram', 'facebook', 'tiktok', 'website', 'referral', 'other');

-- Create enum for engagement types
CREATE TYPE public.engagement_type AS ENUM ('comment', 'dm', 'ad_click', 'form_submission', 'phone_call', 'email', 'other');

-- Create enum for contact status
CREATE TYPE public.contact_status AS ENUM ('new', 'contacted', 'interested', 'not_interested', 'converted', 'follow_up');

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source_platform lead_source NOT NULL DEFAULT 'other',
  engagement_type engagement_type NOT NULL DEFAULT 'other',
  contact_status contact_status NOT NULL DEFAULT 'new',
  interested_keywords TEXT[],
  notes TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated users to manage leads
CREATE POLICY "Authenticated users can view all leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert leads"
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete leads"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bookings_updated_at();

-- Create message_logs table to track all sent messages
CREATE TABLE public.message_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL, -- 'sms', 'whatsapp', 'email'
  recipient TEXT NOT NULL,
  message_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  external_id TEXT, -- Twilio SID or other provider ID
  sent_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on message_logs
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view message logs"
  ON public.message_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert message logs"
  ON public.message_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_leads_source_platform ON public.leads(source_platform);
CREATE INDEX idx_leads_contact_status ON public.leads(contact_status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_message_logs_lead_id ON public.message_logs(lead_id);
CREATE INDEX idx_message_logs_created_at ON public.message_logs(created_at DESC);