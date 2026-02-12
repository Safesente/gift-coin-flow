
-- Create gift card categories table
CREATE TABLE public.gift_card_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  featured_image TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_card_categories ENABLE ROW LEVEL SECURITY;

-- Public read for active categories
CREATE POLICY "Anyone can view active categories"
ON public.gift_card_categories
FOR SELECT
USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage categories"
ON public.gift_card_categories
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add category_id to gift_cards
ALTER TABLE public.gift_cards
ADD COLUMN category_id UUID REFERENCES public.gift_card_categories(id) ON DELETE SET NULL;

-- Create trigger for updated_at
CREATE TRIGGER update_gift_card_categories_updated_at
BEFORE UPDATE ON public.gift_card_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true);

-- Storage policies
CREATE POLICY "Category images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

CREATE POLICY "Admins can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'category-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update category images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'category-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete category images"
ON storage.objects FOR DELETE
USING (bucket_id = 'category-images' AND public.has_role(auth.uid(), 'admin'));
