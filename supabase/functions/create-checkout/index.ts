import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const { amount, cardName, quantity, customerEmail } = await req.json();
    logStep("Request body parsed", { amount, cardName, quantity, customerEmail });

    if (!amount || !cardName || !quantity) {
      throw new Error("Missing required fields: amount, cardName, quantity");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Calculate the price (85% of face value in cents)
    const priceInCents = Math.round(amount * quantity * 0.85 * 100);
    logStep("Price calculated", { priceInCents, faceValue: amount * quantity });

    // Create a checkout session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${cardName} Gift Card`,
              description: `${quantity}x $${amount} gift card(s) - Total face value: $${amount * quantity}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/buy?success=true&amount=${amount}&quantity=${quantity}&card=${encodeURIComponent(cardName)}`,
      cancel_url: `${req.headers.get("origin")}/buy?canceled=true`,
      metadata: {
        cardName,
        amount: amount.toString(),
        quantity: quantity.toString(),
        faceValue: (amount * quantity).toString(),
      },
    });

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
