-- Create email archive table
CREATE TABLE public.email_archive (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  email_data JSONB
);

-- Enable Row Level Security
ALTER TABLE public.email_archive ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert
CREATE POLICY "Service role can insert email archive" 
ON public.email_archive 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow service role to select
CREATE POLICY "Service role can view email archive" 
ON public.email_archive 
FOR SELECT 
USING (true);

-- Create index on sent_at for efficient date-based queries
CREATE INDEX idx_email_archive_sent_at ON public.email_archive(sent_at DESC);