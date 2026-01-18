import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import nodemailer from "https://esm.sh/nodemailer@6.9.9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MarketingEmailRequest {
  subject: string;
  previewText: string;
  headline: string;
  bodyContent: string;
  ctaText?: string;
  ctaUrl?: string;
  sendToAll?: boolean;
  recipientEmails?: string[];
}

const logStep = (step: string, details?: any) => {
  console.log(`[SEND-MARKETING-EMAIL] ${step}`, details ? JSON.stringify(details, null, 2) : '');
};

const handler = async (req: Request): Promise<Response> => {
  logStep("Function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the user is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { 
      subject, 
      previewText, 
      headline, 
      bodyContent, 
      ctaText, 
      ctaUrl,
      sendToAll,
      recipientEmails 
    }: MarketingEmailRequest = await req.json();

    let emails: string[] = [];

    if (sendToAll) {
      // Get all user emails from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("email")
        .not("email", "is", null);

      if (profilesError) {
        throw new Error("Failed to fetch user emails");
      }

      emails = profiles.map(p => p.email).filter(Boolean) as string[];
    } else if (recipientEmails && recipientEmails.length > 0) {
      emails = recipientEmails;
    }

    if (emails.length === 0) {
      return new Response(JSON.stringify({ error: "No recipients specified" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    logStep(`Sending marketing email to ${emails.length} recipients`);

    const ctaSection = ctaText && ctaUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          ${ctaText}
        </a>
      </div>
    ` : "";

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Create transporter once
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

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      const promises = batch.map(async (email) => {
        try {
          await transporter.sendMail({
            from: `gXchange <${Deno.env.get("SMTP_USER")}>`,
            to: email,
            subject,
            text: "Please view this email in an HTML-compatible email client.",
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="x-apple-disable-message-reformatting">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
                <div style="display: none; max-height: 0; overflow: hidden;">${previewText}</div>
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">${headline}</h1>
                  </div>
                  <div style="padding: 40px 30px;">
                    <div style="color: #334155; font-size: 16px; line-height: 1.6;">
                      ${bodyContent}
                    </div>
                    ${ctaSection}
                  </div>
                  <div style="background: #f1f5f9; padding: 20px 30px; text-align: center;">
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 10px;">
                      © ${new Date().getFullYear()} gXchange. All rights reserved.
                    </p>
                    <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                      You received this email because you signed up for gXchange.
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `,
          });
          results.sent++;
        } catch (err: any) {
          results.failed++;
          results.errors.push(`${email}: ${err.message}`);
        }
      });

      await Promise.all(promises);
      
      // Small delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    logStep(`Marketing email results: ${results.sent} sent, ${results.failed} failed`);

    return new Response(JSON.stringify({ 
      success: true, 
      totalRecipients: emails.length,
      sent: results.sent,
      failed: results.failed,
      errors: results.errors.slice(0, 10), // Only return first 10 errors
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    logStep("Error sending marketing email", { error: error.message });
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
