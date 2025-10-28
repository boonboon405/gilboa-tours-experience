-- Fix email_archive RLS policies to restrict to service role only
DROP POLICY IF EXISTS "Service role can insert email archive" ON email_archive;
DROP POLICY IF EXISTS "Service role can view email archive" ON email_archive;

-- Create strict service role policies for email_archive
CREATE POLICY "Service role only can insert email archive"
ON email_archive
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role only can view email archive"
ON email_archive
FOR SELECT
TO authenticated
USING (auth.jwt()->>'role' = 'service_role');

-- Add user_id column to bookings table (nullable for anonymous bookings)
ALTER TABLE bookings 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing overly permissive policies on bookings
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can view all bookings" ON bookings;

-- Create secure policies for bookings table
-- Allow anonymous users to create bookings (for contact forms)
CREATE POLICY "Anyone can create their own bookings"
ON bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- If authenticated, must set user_id to own id
  -- If anonymous, user_id must be null
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()
    ELSE user_id IS NULL
  END
);

-- Only authenticated users can view their own bookings
CREATE POLICY "Users can view own bookings"
ON bookings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only authenticated users can update their own bookings
CREATE POLICY "Users can update own bookings"
ON bookings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Only authenticated users can delete their own bookings
CREATE POLICY "Users can delete own bookings"
ON bookings
FOR DELETE
TO authenticated
USING (user_id = auth.uid());