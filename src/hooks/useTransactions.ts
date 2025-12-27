import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Transaction {
  id: string;
  user_id: string;
  type: "buy" | "sell";
  card_name: string;
  amount: number;
  quantity: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  stripe_session_id: string | null;
  code: string | null;
  country: string | null;
  card_format: string | null;
  created_at: string;
  updated_at: string;
}

export function useTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
}

export function useTransactionStats() {
  const { data: transactions = [] } = useTransactions();

  const stats = {
    totalTransactions: transactions.length,
    sellPending: transactions.filter((t) => t.type === "sell" && t.status === "pending").length,
    sellPaid: transactions.filter((t) => t.type === "sell" && t.status === "paid").length,
    sellCompleted: transactions.filter((t) => t.type === "sell" && t.status === "completed").length,
    buyPending: transactions.filter((t) => t.type === "buy" && t.status === "pending").length,
    buyCompleted: transactions.filter((t) => t.type === "buy" && t.status === "completed").length,
    totalSold: transactions
      .filter((t) => t.type === "sell" && (t.status === "paid" || t.status === "completed"))
      .reduce((sum, t) => sum + Number(t.amount), 0),
    totalBought: transactions
      .filter((t) => t.type === "buy" && t.status === "completed")
      .reduce((sum, t) => sum + Number(t.amount), 0),
  };

  return stats;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (transaction: {
      type: "buy" | "sell";
      card_name: string;
      amount: number;
      quantity?: number;
      stripe_session_id?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: transaction.type,
          card_name: transaction.card_name,
          amount: transaction.amount,
          quantity: transaction.quantity || 1,
          stripe_session_id: transaction.stripe_session_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
