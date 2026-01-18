import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  email: string;
  fullName: string;
  orderType: "buy" | "sell";
  cardName: string;
  amount: number;
  quantity: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  giftCardCode?: string;
}

const logStep = (step: string, details?: any) => {
  console.log(`[SEND-ORDER-NOTIFICATION] ${step}`, details ? JSON.stringify(details, null, 2) : '');
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "pending": return "#f59e0b";
    case "paid": return "#3b82f6";
    case "completed": return "#10b981";
    case "cancelled": return "#ef4444";
    default: return "#6b7280";
  }
};

const getSubject = (orderType: string, status: string, cardName: string): string => {
  if (status === "completed") {
    return orderType === "buy" 
      ? `Your ${cardName} Gift Card is Ready! 🎁`
      : `Payment Sent for Your ${cardName} Gift Card! 💵`;
  }
  if (status === "pending") {
    return orderType === "buy"
      ? `Order Received - ${cardName} Gift Card`
      : `Sell Order Received - ${cardName} Gift Card`;
  }
  if (status === "paid") {
    return `Payment Confirmed - ${cardName} Gift Card`;
  }
  if (status === "cancelled") {
    return `Order Cancelled - ${cardName} Gift Card`;
  }
  return `Order Update - ${cardName} Gift Card`;
};

const handler = async (req: Request): Promise<Response> => {
  logStep("Function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, orderType, cardName, amount, quantity, status, giftCardCode }: OrderNotificationRequest = await req.json();
    logStep("Request received", { email, orderType, cardName, status });

    const statusColor = getStatusColor(status);
    const subject = getSubject(orderType, status, cardName);
    
    let codeSection = "";
    if (orderType === "buy" && status === "completed" && giftCardCode) {
      codeSection = `
        <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
          <p style="color: #065f46; font-size: 14px; margin: 0 0 12px; font-weight: 600;">Your Gift Card Code</p>
          <p style="font-family: 'Courier New', monospace; font-size: 24px; color: #047857; margin: 0; letter-spacing: 2px; font-weight: bold;">
            ${giftCardCode}
          </p>
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, ${orderType === "buy" ? "#eab308" : "#10b981"} 0%, ${orderType === "buy" ? "#ca8a04" : "#059669"} 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              ${orderType === "buy" ? "Buy" : "Sell"} Order Update
            </h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Hi ${fullName || "there"},
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
                    <span style="display: inline-block; background: ${statusColor}20; color: ${statusColor}; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; text-transform: capitalize;">
                      ${status}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            ${codeSection}
            
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              ${status === "completed" && orderType === "buy" 
                ? "Your gift card code is ready! You can also view it anytime in your dashboard."
                : status === "completed" && orderType === "sell"
                ? "Your payment has been sent to your selected payment method. Thank you for trading with us!"
                : status === "pending"
                ? "We have received your order and it is being processed. You will receive another email once it is completed."
                : status === "cancelled"
                ? "Your order has been cancelled. If you have any questions, please contact our support team."
                : "We will notify you of any further updates."}
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

    // Initialize SMTP client
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

    logStep("Sending email via SMTP", { to: email, subject });

    await client.send({
      from: `gXchange <${Deno.env.get("SMTP_USER")}>`,
      to: email,
      subject: subject,
      content: "Please view this email in an HTML-compatible email client.",
      html: htmlContent,
    });

    await client.close();

    logStep("Order notification sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    logStep("Error sending order notification", { error: error.message, stack: error.stack });
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
