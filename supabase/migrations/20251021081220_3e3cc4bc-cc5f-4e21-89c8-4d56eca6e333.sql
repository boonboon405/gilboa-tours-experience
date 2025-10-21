-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_type TEXT NOT NULL,
  tour_date DATE NOT NULL,
  participants_count INTEGER NOT NULL,
  tour_duration TEXT,
  preferred_language TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_company TEXT,
  special_requests TEXT,
  selected_destinations JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create bookings (public booking form)
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view all bookings (for admin dashboard)
CREATE POLICY "Authenticated users can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update bookings
CREATE POLICY "Authenticated users can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated users can delete bookings
CREATE POLICY "Authenticated users can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_bookings_updated_at();