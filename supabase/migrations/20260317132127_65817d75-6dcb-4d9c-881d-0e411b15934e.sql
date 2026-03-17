-- Allow public (anonymous) users to insert leads from contact form
CREATE POLICY "Anyone can submit leads"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);
