import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import nodemailer from "https://esm.sh/nodemailer@6.9.9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName: string;
}

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const json = (body: unknown, status: number) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", ...corsHeaders },
});

const logStep = (step: string, details?: any) => {
  console.log(`[SEND-WELCOME-EMAIL] ${step}`, details ? JSON.stringify(details, null, 2) : '');
};

const handler = async (req: Request): Promise<Response> => {
  logStep("Function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Unauthorized" }, 401);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user?.email) return json({ error: "Unauthorized" }, 401);
    // Only welcome brand-new accounts (within 1 hour of signup)
    if (Date.now() - new Date(user.created_at).getTime() > 60 * 60 * 1000) return json({ success: true }, 200);
    const email = user.email;
    const { data: profile } = await admin.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle();
    const fullName = esc(String(profile?.full_name || "").slice(0, 100));
    logStep("Request received");

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
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to gXchange!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Hi ${fullName || "there"},
            </p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Thank you for joining gXchange! We're excited to have you on board.
            </p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              With gXchange, you can:
            </p>
            <ul style="color: #334155; font-size: 16px; line-height: 1.8; margin: 0 0 30px; padding-left: 20px;">
              <li><strong>Sell gift cards</strong> and get paid fast</li>
              <li><strong>Buy gift cards</strong> at discounted prices</li>
              <li>Trade <strong>100+ gift card brands</strong></li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://gxchange.cards/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0;">
              If you have any questions, simply reply to this email - we're always happy to help!
            </p>
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

    // Create transporter using SMTP
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

    logStep("Sending email via SMTP");

    await transporter.sendMail({
      from: `gXchange <${Deno.env.get("SMTP_USER")}>`,
      to: email,
      subject: "Welcome to gXchange! 🎉",
      text: "Please view this email in an HTML-compatible email client.",
      html: htmlContent,
    });

    logStep("Welcome email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    logStep("Error sending welcome email", { error: error.message });
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
