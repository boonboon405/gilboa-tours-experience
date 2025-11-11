-- Create prompt version history table
CREATE TABLE public.ai_prompt_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID NOT NULL REFERENCES public.ai_prompts(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  changed_by TEXT,
  change_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_prompt_versions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read version history
CREATE POLICY "Anyone can read prompt versions"
  ON public.ai_prompt_versions
  FOR SELECT
  USING (true);

-- Allow anyone to insert versions (logged automatically on update)
CREATE POLICY "Anyone can insert prompt versions"
  ON public.ai_prompt_versions
  FOR INSERT
  WITH CHECK (true);

-- Create function to auto-save version history
CREATE OR REPLACE FUNCTION public.save_prompt_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only save if prompt_text actually changed
  IF OLD.prompt_text IS DISTINCT FROM NEW.prompt_text THEN
    INSERT INTO public.ai_prompt_versions (prompt_id, prompt_text, changed_by)
    VALUES (OLD.id, OLD.prompt_text, 'system');
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to save versions on update
CREATE TRIGGER save_prompt_version_trigger
  BEFORE UPDATE ON public.ai_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.save_prompt_version();

-- Insert initial versions for existing prompts
INSERT INTO public.ai_prompt_versions (prompt_id, prompt_text, changed_by, change_note)
SELECT id, prompt_text, 'system', 'Initial version'
FROM public.ai_prompts;