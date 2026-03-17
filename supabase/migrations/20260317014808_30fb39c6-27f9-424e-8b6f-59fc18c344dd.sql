
-- Add language column to knowledge_base
ALTER TABLE public.knowledge_base ADD COLUMN language text NOT NULL DEFAULT 'he';

-- Add language column to testimonials
ALTER TABLE public.testimonials ADD COLUMN language text NOT NULL DEFAULT 'he';
