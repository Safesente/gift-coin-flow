-- Create table for country-specific gift card rates
CREATE TABLE public.gift_card_country_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_card_id UUID NOT NULL REFERENCES public.gift_cards(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  currency_symbol TEXT NOT NULL,
  buy_rate NUMERIC NOT NULL DEFAULT 85,
  sell_rate NUMERIC NOT NULL DEFAULT 47,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(gift_card_id, country_code)
);

-- Enable RLS
ALTER TABLE public.gift_card_country_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view gift card country rates"
ON public.gift_card_country_rates
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert gift card country rates"
ON public.gift_card_country_rates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gift card country rates"
ON public.gift_card_country_rates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gift card country rates"
ON public.gift_card_country_rates
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_gift_card_country_rates_updated_at
BEFORE UPDATE ON public.gift_card_country_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();