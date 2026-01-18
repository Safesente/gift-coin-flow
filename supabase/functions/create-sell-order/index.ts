import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SELL-ORDER] ${step}${detailsStr}`);
};

const sendOrderNotification = async (email: string, fullName: string, cardName: string, amount: number, quantity: number) => {
  try {
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get("SMTP_HOST") || "",
        port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
        tls: false,
        auth: {
          username: Deno.env.get("SMTP_USER") || "",
          password: Deno.env.get("SMTP_PASS") || "",
        },
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
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Sell Order Received</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Hi ${fullName || "there"},
            </p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              We have received your sell order and it's now being processed.
            </p>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #64748b; padding: 8px 0;">Gift Card:</td>
                  <td style="color: #334155; font-weight: 600; text-align: right; padding: 8px 0;">${cardName}</td>
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
              You will receive another email once your order is reviewed and completed.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://gift-coin-flow.lovable.app/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
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

    await client.send({
      from: `gXchange <${Deno.env.get("SMTP_USER")}>`,
      to: email,
      subject: `Sell Order Received - ${cardName} Gift Card`,
      content: "Please view this email in an HTML-compatible email client.",
      html: htmlContent,
    });

    await client.close();
    logStep("Order notification email sent", { email });
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { cardName, amount, quantity, paymentMethod, paymentDetails, giftCardCode, country, cardFormat, screenshotUrl } = await req.json();
    logStep("Request body parsed", { cardName, amount, quantity, paymentMethod, country, cardFormat, hasCode: !!giftCardCode, hasScreenshot: !!screenshotUrl });

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
        code: giftCardCode,
        country: country,
        card_format: cardFormat,
        screenshot_url: screenshotUrl,
        payment_method: paymentMethod,
        payment_details: paymentDetails,
      })
      .select()
      .single();

    if (txnError) {
      logStep("Failed to create transaction", { error: txnError.message });
      throw new Error(`Failed to create transaction: ${txnError.message}`);
    }

    logStep("Transaction created", { transactionId: transaction.id, payout });

    // Get user profile for name
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single();

    // Send notification email
    if (user.email) {
      await sendOrderNotification(user.email, profile?.full_name || "Customer", cardName, amount, quantity);
    }

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
