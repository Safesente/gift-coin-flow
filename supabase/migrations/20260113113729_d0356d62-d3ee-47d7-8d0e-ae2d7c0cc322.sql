-- Add payment method columns to transactions table
ALTER TABLE public.transactions 
ADD COLUMN payment_method text,
ADD COLUMN payment_details text;