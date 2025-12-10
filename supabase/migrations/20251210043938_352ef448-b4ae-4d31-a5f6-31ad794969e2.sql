-- Create gallery_images table for dynamic gallery content
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('gilboa', 'springs', 'activities')),
  title TEXT NOT NULL,
  description TEXT,
  alt_text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view active gallery images
CREATE POLICY "Anyone can view active gallery images"
ON public.gallery_images
FOR SELECT
USING (is_active = true);

-- Admins can manage gallery images
CREATE POLICY "Admins can manage gallery images"
ON public.gallery_images
FOR ALL
USING (is_admin(auth.uid()));

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true);

-- Storage policies for gallery images
CREATE POLICY "Anyone can view gallery images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can upload gallery images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'gallery-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update gallery images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'gallery-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete gallery images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'gallery-images' AND is_admin(auth.uid()));