-- Add RLS policy to allow admins to update chat messages
CREATE POLICY "Admins can update chat messages"
ON public.chat_messages
FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Add RLS policy to allow admins to delete chat messages if needed
CREATE POLICY "Admins can delete chat messages"
ON public.chat_messages
FOR DELETE
USING (is_admin(auth.uid()));