
-- P2P Listings: users list gift cards for sale
CREATE TABLE public.p2p_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL,
  card_name text NOT NULL,
  category_id uuid REFERENCES public.gift_card_categories(id),
  amount numeric NOT NULL,
  price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  country text,
  card_format text DEFAULT 'digital',
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled', 'expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.p2p_listings ENABLE ROW LEVEL SECURITY;

-- Everyone can view active listings
CREATE POLICY "Anyone can view active listings"
ON public.p2p_listings FOR SELECT
USING (status = 'active');

-- Users can view their own listings regardless of status
CREATE POLICY "Users can view own listings"
ON public.p2p_listings FOR SELECT
USING (auth.uid() = seller_id);

-- Users can create listings
CREATE POLICY "Users can create listings"
ON public.p2p_listings FOR INSERT
WITH CHECK (auth.uid() = seller_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings"
ON public.p2p_listings FOR UPDATE
USING (auth.uid() = seller_id);

-- Admins can view all listings
CREATE POLICY "Admins can view all listings"
ON public.p2p_listings FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update all listings
CREATE POLICY "Admins can update all listings"
ON public.p2p_listings FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- P2P Trades: tracks trades between buyer and seller
CREATE TABLE public.p2p_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.p2p_listings(id),
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  amount numeric NOT NULL,
  price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'completed', 'cancelled', 'disputed')),
  payment_method text,
  payment_proof_url text,
  card_code text,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.p2p_trades ENABLE ROW LEVEL SECURITY;

-- Buyers can view their trades
CREATE POLICY "Buyers can view own trades"
ON public.p2p_trades FOR SELECT
USING (auth.uid() = buyer_id);

-- Sellers can view their trades
CREATE POLICY "Sellers can view own trades"
ON public.p2p_trades FOR SELECT
USING (auth.uid() = seller_id);

-- Buyers can create trades
CREATE POLICY "Buyers can create trades"
ON public.p2p_trades FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Buyers can update their trades (e.g., upload payment proof)
CREATE POLICY "Buyers can update own trades"
ON public.p2p_trades FOR UPDATE
USING (auth.uid() = buyer_id);

-- Sellers can update their trades (e.g., provide card code)
CREATE POLICY "Sellers can update own trades"
ON public.p2p_trades FOR UPDATE
USING (auth.uid() = seller_id);

-- Admins can view all trades
CREATE POLICY "Admins can view all trades"
ON public.p2p_trades FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update all trades
CREATE POLICY "Admins can update all trades"
ON public.p2p_trades FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_p2p_listings_updated_at
BEFORE UPDATE ON public.p2p_listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_p2p_trades_updated_at
BEFORE UPDATE ON public.p2p_trades
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false);

CREATE POLICY "Users can upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs' AND has_role(auth.uid(), 'admin'));
