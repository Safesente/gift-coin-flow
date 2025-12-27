import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface GiftCard {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
}

export interface AdminTransaction {
  id: string;
  user_id: string;
  type: "buy" | "sell";
  card_name: string;
  amount: number;
  quantity: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  code: string | null;
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useIsAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .rpc("has_role", { _user_id: user.id, _role: "admin" });
      
      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      return data as boolean;
    },
    enabled: !!user,
  });
}

export function useAllTransactions() {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ["adminTransactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as AdminTransaction[];
    },
    enabled: isAdmin === true,
  });
}

export function useAllProfiles() {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ["adminProfiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: isAdmin === true,
  });
}

export function useAllUserRoles() {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ["adminUserRoles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: isAdmin === true,
  });
}

export function useGiftCards(adminView = false) {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ["giftCards", adminView],
    queryFn: async () => {
      let query = supabase.from("gift_cards").select("*");
      
      if (!adminView) {
        query = query.eq("is_active", true);
      }
      
      const { data, error } = await query.order("name", { ascending: true });
      
      if (error) throw error;
      return data as GiftCard[];
    },
    enabled: adminView ? isAdmin === true : true,
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      code 
    }: { 
      id: string; 
      status?: "pending" | "paid" | "completed" | "cancelled";
      code?: string;
    }) => {
      const updateData: Record<string, unknown> = {};
      if (status) updateData.status = status;
      if (code !== undefined) updateData.code = code;

      const { data, error } = await supabase
        .from("transactions")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useToggleGiftCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from("gift_cards")
        .update({ is_active })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
    },
  });
}

export function useCreateGiftCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftCard: { 
      name: string; 
      description?: string; 
      image_url?: string;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("gift_cards")
        .insert(giftCard)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
    },
  });
}

export function useDeleteGiftCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("gift_cards")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
    },
  });
}
