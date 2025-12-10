-- Create a table to store generated AI images
CREATE TABLE public.generated_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_type TEXT NOT NULL, -- 'landscape', 'location', 'odt'
  image_key TEXT NOT NULL, -- variation number or location key
  image_url TEXT NOT NULL,
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(image_type, image_key)
);

-- Enable RLS
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access (images are public)
CREATE POLICY "Anyone can view generated images"
ON public.generated_images
FOR SELECT
USING (true);

-- Allow insert from edge functions (using service role)
CREATE POLICY "Service role can insert images"
ON public.generated_images
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_generated_images_type_key ON public.generated_images(image_type, image_key);