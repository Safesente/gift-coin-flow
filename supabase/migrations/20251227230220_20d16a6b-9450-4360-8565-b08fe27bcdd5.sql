-- Add new columns to transactions table for country, card format, and screenshot
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS card_format text CHECK (card_format IN ('physical', 'digital')),
ADD COLUMN IF NOT EXISTS screenshot_url text;

-- Create storage bucket for transaction screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('transaction-screenshots', 'transaction-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for transaction screenshots bucket
CREATE POLICY "Users can upload their own screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'transaction-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own screenshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'transaction-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all screenshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'transaction-screenshots' AND public.has_role(auth.uid(), 'admin'));