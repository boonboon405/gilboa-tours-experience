-- Add confidence score to live chat messages
ALTER TABLE public.live_chat_messages 
ADD COLUMN ai_confidence_score DECIMAL(3,2) CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 1);

-- Add index for filtering low confidence messages
CREATE INDEX idx_live_chat_messages_confidence ON public.live_chat_messages(ai_confidence_score) 
WHERE ai_confidence_score IS NOT NULL;