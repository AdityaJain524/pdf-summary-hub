-- Create summaries table to store user PDF summaries
CREATE TABLE IF NOT EXISTS public.summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own summaries
CREATE POLICY "Users can view their own summaries"
  ON public.summaries
  FOR SELECT
  USING (true);

-- Create policy for inserting summaries
CREATE POLICY "Users can insert summaries"
  ON public.summaries
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_summaries_user_email ON public.summaries(user_email);
CREATE INDEX idx_summaries_created_at ON public.summaries(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();