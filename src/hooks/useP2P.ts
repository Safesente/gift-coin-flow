import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useAdmin";

export interface P2PListing {
  id: string;
  seller_id: string;
  card_name: string;
  category_id: string | null;
  amount: number;
  price: number;
  currency: string;
  country: string | null;
  card_format: string | null;
  description: string | null;
  status: "active" | "sold" | "cancelled" | "expired";
  created_at: string;
  updated_at: string;
}

export interface P2PTrade {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  price: number;
  status: "pending" | "paid" | "completed" | "cancelled" | "disputed";
  payment_method: string | null;
  payment_proof_url: string | null;
  card_code: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch active listings for the marketplace
export function useP2PListings() {
  return useQuery({
    queryKey: ["p2pListings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("p2p_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as P2PListing[];
    },
  });
}

// Fetch current user's listings
export function useMyListings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["myP2PListings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("p2p_listings")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as P2PListing[];
    },
    enabled: !!user,
  });
}

// Fetch current user's trades (as buyer or seller)
export function useMyTrades() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["myP2PTrades", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Fetch as buyer
      const { data: buyerTrades, error: e1 } = await supabase
        .from("p2p_trades")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });
      if (e1) throw e1;

      // Fetch as seller
      const { data: sellerTrades, error: e2 } = await supabase
        .from("p2p_trades")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      if (e2) throw e2;

      // Merge and deduplicate
      const all = [...(buyerTrades || []), ...(sellerTrades || [])];
      const unique = Array.from(new Map(all.map((t) => [t.id, t])).values());
      unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return unique as P2PTrade[];
    },
    enabled: !!user,
  });
}

// Admin: all listings
export function useAllP2PListings() {
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ["adminP2PListings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("p2p_listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as P2PListing[];
    },
    enabled: isAdmin === true,
  });
}

// Admin: all trades
export function useAllP2PTrades() {
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ["adminP2PTrades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("p2p_trades")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as P2PTrade[];
    },
    enabled: isAdmin === true,
  });
}

// Create a listing
export function useCreateListing() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (listing: {
      card_name: string;
      category_id?: string;
      amount: number;
      price: number;
      currency?: string;
      country?: string;
      card_format?: string;
      description?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("p2p_listings")
        .insert({ ...listing, seller_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["p2pListings"] });
      queryClient.invalidateQueries({ queryKey: ["myP2PListings"] });
    },
  });
}

// Update listing status
export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string }) => {
      const { data, error } = await supabase
        .from("p2p_listings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["p2pListings"] });
      queryClient.invalidateQueries({ queryKey: ["myP2PListings"] });
      queryClient.invalidateQueries({ queryKey: ["adminP2PListings"] });
    },
  });
}

// Create a trade (buyer initiates)
export function useCreateTrade() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (trade: {
      listing_id: string;
      seller_id: string;
      amount: number;
      price: number;
      payment_method?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("p2p_trades")
        .insert({ ...trade, buyer_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myP2PTrades"] });
      queryClient.invalidateQueries({ queryKey: ["p2pListings"] });
      queryClient.invalidateQueries({ queryKey: ["adminP2PTrades"] });
    },
  });
}

// Update a trade (payment proof, status, etc.)
export function useUpdateTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      status?: string;
      payment_proof_url?: string;
      card_code?: string;
      admin_notes?: string;
      payment_method?: string;
    }) => {
      const { data, error } = await supabase
        .from("p2p_trades")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myP2PTrades"] });
      queryClient.invalidateQueries({ queryKey: ["adminP2PTrades"] });
      queryClient.invalidateQueries({ queryKey: ["p2pListings"] });
    },
  });
}
