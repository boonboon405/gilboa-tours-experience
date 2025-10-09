-- Create storage bucket for landscape images
INSERT INTO storage.buckets (id, name, public)
VALUES ('landscape-images', 'landscape-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view images (public bucket)
CREATE POLICY "Public Access to Landscape Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'landscape-images');

-- Allow anyone to upload images (for the image generator)
CREATE POLICY "Anyone can upload landscape images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'landscape-images');

-- Allow anyone to delete their images
CREATE POLICY "Anyone can delete landscape images"
ON storage.objects FOR DELETE
USING (bucket_id = 'landscape-images');