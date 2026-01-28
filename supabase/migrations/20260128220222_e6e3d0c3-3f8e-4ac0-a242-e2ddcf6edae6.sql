-- Create visitors table
CREATE TABLE public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_path text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  city text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert visitor data (anonymous tracking)
CREATE POLICY "Anyone can insert visitor data"
ON public.visitors
FOR INSERT
WITH CHECK (true);

-- Only admins can view visitor data
CREATE POLICY "Admins can view all visitors"
ON public.visitors
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete visitor data
CREATE POLICY "Admins can delete visitor data"
ON public.visitors
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_visitors_created_at ON public.visitors(created_at DESC);
CREATE INDEX idx_visitors_page_path ON public.visitors(page_path);
CREATE INDEX idx_visitors_session_id ON public.visitors(session_id);