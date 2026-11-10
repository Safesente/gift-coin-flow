import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import nodemailer from "https://esm.sh/nodemailer@6.9.9";
import { checkoutUser } from "./auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const ALLOWED_AMOUNTS = [10, 15, 20, 25, 50, 100, 150, 200, 250, 500];
const ALLOWED_ORIGINS = ["https://gxchange.cards", "https://www.gxchange.cards", "https://gift-coin-flow.lovable.app"];
const safeOrigin = (origin: string | null) => {
  if (!origin) return "https://gxchange.cards";
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin) || /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return origin;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return origin;
  return "https://gxchange.cards";
};

const sendOrderNotification = async (email: string, fullName: string, cardName: string, amount: number, quantity: number) => {
  try {
    const transporter = nodemailer.createTransport({
      host: Deno.env.get("SMTP_HOST"),
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      secure: false,
      auth: {
        user: Deno.env.get("SMTP_USER"),
        pass: Deno.env.get("SMTP_PASS"),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Buy Order Received</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Hi ${esc(fullName || "there")},
            </p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              We have received your buy order and it's now being processed.
            </p>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #64748b; padding: 8px 0;">Gift Card:</td>
                  <td style="color: #334155; font-weight: 600; text-align: right; padding: 8px 0;">${esc(cardName)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 8px 0;">Amount:</td>
                  <td style="color: #334155; font-weight: 600; text-align: right; padding: 8px 0;">$${amount} x ${quantity}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 8px 0;">Status:</td>
                  <td style="text-align: right; padding: 8px 0;">
                    <span style="display: inline-block; background: #f59e0b20; color: #f59e0b; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                      Pending
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              You will receive another email with your gift card code once payment is confirmed and your order is completed.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://gxchange.cards/dashboard" style="display: inline-block; background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View in Dashboard
              </a>
            </div>
          </div>
          <div style="background: #f1f5f9; padding: 20px 30px; text-align: center;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} gXchange. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `gXchange <${Deno.env.get("SMTP_USER")}>`,
      to: email,
      subject: `Order Received - ${cardName} Gift Card`,
      text: "Please view this email in an HTML-compatible email client.",
      html: htmlContent,
    });

    logStep("Order notification email sent");
  } catch (error: any) {
    logStep("Failed to send notification email", { error: error.message });
  }
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

    const buyer = await checkoutUser(req.headers.get("Authorization"), (token) => supabaseClient.auth.getUser(token));
    if (!buyer) {
      return new Response(JSON.stringify({ error: "Sign in before checkout." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const body = await req.json();
    const amount = Number(body?.amount);
    const quantity = Number(body?.quantity);
    const giftCardId = typeof body?.giftCardId === "string" ? body.giftCardId : "";
    const country = typeof body?.country === "string" ? body.country.slice(0, 8) : "";
    const badRequest = (msg: string) => new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400,
    });
    if (!ALLOWED_AMOUNTS.includes(amount)) return badRequest("Invalid amount");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) return badRequest("Invalid quantity");
    if (!/^[0-9a-f-]{36}$/i.test(giftCardId)) return badRequest("Invalid gift card");

    // Server-owned pricing
    const { data: card } = await supabaseAdmin
      .from("gift_cards").select("id, name, buy_rate, is_active").eq("id", giftCardId).maybeSingle();
    if (!card || !card.is_active) return badRequest("Gift card unavailable");
    let ratePct = Number(card.buy_rate) || 85;
    if (country) {
      const { data: cr } = await supabaseAdmin
        .from("gift_card_country_rates").select("buy_rate").eq("gift_card_id", giftCardId).eq("country_code", country).maybeSingle();
      if (cr?.buy_rate) ratePct = Number(cr.buy_rate);
    }
    if (!(ratePct > 0 && ratePct <= 100)) return badRequest("Pricing unavailable");
    const cardName: string = card.name;
    logStep("Request validated", { amount, quantity, giftCardId });

    const BUY_RATE = ratePct / 100;
    const priceInCents = Math.round(amount * BUY_RATE * quantity * 100);
    const faceValue = amount * quantity;
    logStep("Price calculated", { priceInCents, faceValue });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if user is authenticated
    const userEmail = buyer.email;
    const userId = buyer.id;
    let customerId: string | undefined;
    let fullName: string | undefined;

    {
      {
        logStep("User authenticated", { userId });

        // Get user profile for name
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("full_name")
          .eq("user_id", userId)
          .single();
        fullName = profile?.full_name || undefined;

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

    const origin = safeOrigin(req.headers.get("origin"));

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
        user_id: userId,
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
        
        // Send order notification email
        if (userEmail) {
          await sendOrderNotification(userEmail, fullName || "Customer", cardName, amount, quantity);
        }
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
