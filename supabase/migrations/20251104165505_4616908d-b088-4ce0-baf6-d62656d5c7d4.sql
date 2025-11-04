-- Drop existing restrictive INSERT policy if exists
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;

-- Create new policy allowing public bookings
CREATE POLICY "Allow public bookings"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (true);