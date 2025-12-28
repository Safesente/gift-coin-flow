import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GiftCardCountryRate {
  id: string;
  gift_card_id: string;
  country_code: string;
  country_name: string;
  currency_code: string;
  currency_symbol: string;
  buy_rate: number;
  sell_rate: number;
  created_at: string;
  updated_at: string;
}

export function useCountryRates(giftCardId?: string) {
  return useQuery({
    queryKey: ["countryRates", giftCardId],
    queryFn: async () => {
      let query = supabase.from("gift_card_country_rates").select("*");
      
      if (giftCardId) {
        query = query.eq("gift_card_id", giftCardId);
      }
      
      const { data, error } = await query.order("country_name", { ascending: true });
      
      if (error) throw error;
      return data as GiftCardCountryRate[];
    },
    enabled: true,
  });
}

export function useCountryRateForCard(giftCardId: string | undefined, countryCode: string | undefined) {
  return useQuery({
    queryKey: ["countryRate", giftCardId, countryCode],
    queryFn: async () => {
      if (!giftCardId || !countryCode) return null;
      
      const { data, error } = await supabase
        .from("gift_card_country_rates")
        .select("*")
        .eq("gift_card_id", giftCardId)
        .eq("country_code", countryCode)
        .maybeSingle();
      
      if (error) throw error;
      return data as GiftCardCountryRate | null;
    },
    enabled: !!giftCardId && !!countryCode,
  });
}

export function useCreateCountryRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rate: {
      gift_card_id: string;
      country_code: string;
      country_name: string;
      currency_code: string;
      currency_symbol: string;
      buy_rate: number;
      sell_rate: number;
    }) => {
      const { data, error } = await supabase
        .from("gift_card_country_rates")
        .insert(rate)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countryRates"] });
    },
  });
}

export function useUpdateCountryRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      buy_rate?: number;
      sell_rate?: number;
    }) => {
      const { data, error } = await supabase
        .from("gift_card_country_rates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countryRates"] });
      queryClient.invalidateQueries({ queryKey: ["countryRate"] });
    },
  });
}

export function useDeleteCountryRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("gift_card_country_rates")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countryRates"] });
      queryClient.invalidateQueries({ queryKey: ["countryRate"] });
    },
  });
}
