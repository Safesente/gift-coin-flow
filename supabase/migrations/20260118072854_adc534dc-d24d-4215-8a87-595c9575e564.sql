-- Create blog_categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Anyone can view blog categories" 
ON public.blog_categories 
FOR SELECT 
USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can insert blog categories" 
ON public.blog_categories 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog categories" 
ON public.blog_categories 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog categories" 
ON public.blog_categories 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add category_id to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL;