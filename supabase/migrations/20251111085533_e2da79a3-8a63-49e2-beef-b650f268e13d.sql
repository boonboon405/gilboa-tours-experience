-- Add feedback rating to live chat messages
ALTER TABLE live_chat_messages 
ADD COLUMN agent_feedback text CHECK (agent_feedback IN ('helpful', 'not_helpful', NULL));

-- Create index for querying feedback
CREATE INDEX idx_live_chat_messages_feedback 
ON live_chat_messages(agent_feedback) 
WHERE agent_feedback IS NOT NULL;

-- Add comment
COMMENT ON COLUMN live_chat_messages.agent_feedback IS 'Agent rating of AI response quality: helpful or not_helpful';
