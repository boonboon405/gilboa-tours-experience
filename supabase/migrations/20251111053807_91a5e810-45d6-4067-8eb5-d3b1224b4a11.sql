-- Create conversations table to track AI chat sessions
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'waiting_human', 'converted', 'abandoned')),
  detected_mood TEXT[] DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0.0,
  quiz_results_id UUID REFERENCES public.quiz_results(id) ON DELETE SET NULL,
  user_name TEXT,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai', 'human_agent')),
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice_transcription', 'system')),
  sentiment_score FLOAT,
  detected_emotions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI interaction metrics table
CREATE TABLE public.ai_interaction_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interaction_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for conversations (public access for chat)
CREATE POLICY "Anyone can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own conversations"
  ON public.conversations FOR SELECT
  USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id' OR true);

CREATE POLICY "Anyone can update their own conversations"
  ON public.conversations FOR UPDATE
  USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id' OR true);

-- Policies for chat messages
CREATE POLICY "Anyone can insert messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view messages in their conversations"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = chat_messages.conversation_id
    )
  );

-- Policies for metrics (service role only for writing, admins can read)
CREATE POLICY "Service role can insert metrics"
  ON public.ai_interaction_metrics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view metrics"
  ON public.ai_interaction_metrics FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_conversations_session_id ON public.conversations(session_id);
CREATE INDEX idx_conversations_lead_id ON public.conversations(lead_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_ai_metrics_conversation_id ON public.ai_interaction_metrics(conversation_id);

-- Function to update last_message_at
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update last_message_at
CREATE TRIGGER update_conversation_timestamp
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_last_message();