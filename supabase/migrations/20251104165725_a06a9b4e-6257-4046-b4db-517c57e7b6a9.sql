-- Drop all existing INSERT policies on bookings table
DROP POLICY IF EXISTS "Allow public bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;

-- Create a single permissive policy for public bookings
CREATE POLICY "Enable insert for all users"
ON public.bookings
FOR INSERT
WITH CHECK (true);