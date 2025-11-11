-- Create live chat conversations table
CREATE TABLE IF NOT EXISTS public.live_chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'closed')),
  assigned_to TEXT,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create live chat messages table
CREATE TABLE IF NOT EXISTS public.live_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.live_chat_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('visitor', 'agent', 'system')),
  sender_name TEXT,
  message TEXT NOT NULL,
  read_by_agent BOOLEAN DEFAULT false,
  read_by_visitor BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.live_chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations (allow all for now, can be restricted later)
CREATE POLICY "Anyone can create conversations"
ON public.live_chat_conversations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view conversations"
ON public.live_chat_conversations
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update conversations"
ON public.live_chat_conversations
FOR UPDATE
USING (true);

-- RLS Policies for messages
CREATE POLICY "Anyone can create messages"
ON public.live_chat_messages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
ON public.live_chat_messages
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update messages"
ON public.live_chat_messages
FOR UPDATE
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_live_chat_conversations_status ON public.live_chat_conversations(status);
CREATE INDEX idx_live_chat_conversations_created_at ON public.live_chat_conversations(created_at DESC);
CREATE INDEX idx_live_chat_messages_conversation_id ON public.live_chat_messages(conversation_id);
CREATE INDEX idx_live_chat_messages_created_at ON public.live_chat_messages(created_at);

-- Enable realtime for live chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_messages;

-- Set replica identity for realtime updates
ALTER TABLE public.live_chat_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.live_chat_messages REPLICA IDENTITY FULL;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_live_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_live_chat_conversations_updated_at
BEFORE UPDATE ON public.live_chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_live_chat_updated_at();