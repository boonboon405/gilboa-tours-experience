-- Create storage bucket for ODT images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('odt-images', 'odt-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public Access for ODT images"
ON storage.objects FOR SELECT
USING (bucket_id = 'odt-images');

-- Allow authenticated uploads (for the edge function via service role)
CREATE POLICY "Service role can upload ODT images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'odt-images');