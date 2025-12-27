import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
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

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const { amount, cardName, quantity } = await req.json();
    logStep("Request body parsed", { amount, cardName, quantity });

    if (!amount || !cardName || !quantity) {
      throw new Error("Missing required fields: amount, cardName, quantity");
    }

    // Calculate price (85% of face value)
    const BUY_RATE = 0.85;
    const priceInCents = Math.round(amount * BUY_RATE * quantity * 100);
    const faceValue = amount * quantity;
    logStep("Price calculated", { priceInCents, faceValue });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if user is authenticated
    const authHeader = req.headers.get("Authorization");
    let userEmail: string | undefined;
    let userId: string | undefined;
    let customerId: string | undefined;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      if (userData.user) {
        userEmail = userData.user.email;
        userId = userData.user.id;
        logStep("User authenticated", { userId, email: userEmail });

        // Check for existing Stripe customer
        if (userEmail) {
          const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
          if (customers.data.length > 0) {
            customerId = customers.data[0].id;
            logStep("Existing Stripe customer found", { customerId });
          }
        }
      }
    }

    const origin = req.headers.get("origin") || "http://localhost:5173";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${cardName} - $${amount} Gift Card`,
              description: `${quantity}x $${amount} gift card(s)`,
            },
            unit_amount: Math.round(amount * BUY_RATE * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${origin}/buy?success=true&amount=${amount}&quantity=${quantity}&card=${encodeURIComponent(cardName)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/buy?canceled=true`,
      metadata: {
        card_name: cardName,
        face_value: faceValue.toString(),
        quantity: quantity.toString(),
        user_id: userId || "",
      },
    });

    // Create transaction record if user is authenticated
    if (userId) {
      const { error: txnError } = await supabaseAdmin
        .from("transactions")
        .insert({
          user_id: userId,
          type: "buy",
          card_name: cardName,
          amount: faceValue,
          quantity: quantity,
          status: "pending",
          stripe_session_id: session.id,
        });

      if (txnError) {
        logStep("Failed to create transaction", { error: txnError.message });
      } else {
        logStep("Transaction record created");
      }
    }

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
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
