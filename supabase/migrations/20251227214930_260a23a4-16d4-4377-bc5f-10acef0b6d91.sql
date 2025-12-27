-- Add code column to transactions for seller codes
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS code text;

-- Create gift_cards table to manage card types
CREATE TABLE public.gift_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on gift_cards
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;

-- Anyone can view active gift cards
CREATE POLICY "Anyone can view active gift cards"
ON public.gift_cards
FOR SELECT
USING (is_active = true);

-- Admins can view all gift cards
CREATE POLICY "Admins can view all gift cards"
ON public.gift_cards
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert gift cards
CREATE POLICY "Admins can insert gift cards"
ON public.gift_cards
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update gift cards
CREATE POLICY "Admins can update gift cards"
ON public.gift_cards
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete gift cards
CREATE POLICY "Admins can delete gift cards"
ON public.gift_cards
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for transactions - view all
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for transactions - update all
CREATE POLICY "Admins can update all transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for profiles - view all
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for user_roles - view all
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for user_roles - manage roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default gift cards
INSERT INTO public.gift_cards (name, description, image_url, is_active) VALUES
('Amazon', 'Amazon Gift Cards', 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400', true),
('iTunes', 'Apple iTunes & App Store', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400', true),
('Google Play', 'Google Play Store Credits', 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400', true),
('Steam', 'Steam Gaming Platform', 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400', true),
('PlayStation', 'PlayStation Network', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', true),
('Xbox', 'Xbox Live & Game Pass', 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400', true),
('Netflix', 'Netflix Streaming', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400', true),
('Spotify', 'Spotify Premium', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400', true);

-- Trigger for gift_cards updated_at
CREATE TRIGGER update_gift_cards_updated_at
BEFORE UPDATE ON public.gift_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();