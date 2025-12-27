-- Add rate and logo_url columns to gift_cards table
ALTER TABLE public.gift_cards 
ADD COLUMN rate numeric DEFAULT 47 NOT NULL,
ADD COLUMN logo_url text;

-- Create storage bucket for gift card logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gift-card-logos', 'gift-card-logos', true);

-- Allow anyone to view logos (public bucket)
CREATE POLICY "Anyone can view gift card logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'gift-card-logos');

-- Allow admins to upload logos
CREATE POLICY "Admins can upload gift card logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gift-card-logos' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update logos
CREATE POLICY "Admins can update gift card logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gift-card-logos' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete logos
CREATE POLICY "Admins can delete gift card logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gift-card-logos' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);