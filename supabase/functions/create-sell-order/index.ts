import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SELL-ORDER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { cardName, amount, quantity, paymentMethod, paymentDetails } = await req.json();
    logStep("Request body parsed", { cardName, amount, quantity, paymentMethod });

    // Calculate payout (47% of face value)
    const SELL_RATE = 0.47;
    const totalValue = amount * quantity;
    const payout = totalValue * SELL_RATE;

    // Create transaction record
    const { data: transaction, error: txnError } = await supabaseAdmin
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "sell",
        card_name: cardName,
        amount: totalValue,
        quantity: quantity,
        status: "pending",
      })
      .select()
      .single();

    if (txnError) {
      logStep("Failed to create transaction", { error: txnError.message });
      throw new Error(`Failed to create transaction: ${txnError.message}`);
    }

    logStep("Transaction created", { transactionId: transaction.id, payout });

    return new Response(JSON.stringify({ 
      success: true, 
      transactionId: transaction.id,
      payout: payout.toFixed(2),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
