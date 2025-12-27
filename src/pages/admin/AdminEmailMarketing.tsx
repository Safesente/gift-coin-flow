import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Mail, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminEmailMarketing() {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [sendToAll, setSendToAll] = useState(true);
  const [lastResult, setLastResult] = useState<{ sent: number; failed: number } | null>(null);
  
  const [emailData, setEmailData] = useState({
    subject: "",
    previewText: "",
    headline: "",
    bodyContent: "",
    ctaText: "",
    ctaUrl: "",
    recipientEmails: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.subject || !emailData.headline || !emailData.bodyContent) {
      toast({
        title: "Missing Fields",
        description: "Please fill in subject, headline, and body content.",
        variant: "destructive",
      });
      return;
    }

    if (!sendToAll && !emailData.recipientEmails.trim()) {
      toast({
        title: "No Recipients",
        description: "Please enter recipient emails or enable 'Send to all users'.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setLastResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Not authenticated");
      }

      const recipientEmails = sendToAll 
        ? undefined 
        : emailData.recipientEmails.split(/[,\n]/).map(e => e.trim()).filter(Boolean);

      const { data, error } = await supabase.functions.invoke("send-marketing-email", {
        body: {
          subject: emailData.subject,
          previewText: emailData.previewText || emailData.subject,
          headline: emailData.headline,
          bodyContent: emailData.bodyContent,
          ctaText: emailData.ctaText || undefined,
          ctaUrl: emailData.ctaUrl || undefined,
          sendToAll,
          recipientEmails,
        },
      });

      if (error) throw error;

      setLastResult({ sent: data.sent, failed: data.failed });
      
      toast({
        title: "Emails Sent!",
        description: `Successfully sent ${data.sent} email(s). ${data.failed > 0 ? `${data.failed} failed.` : ""}`,
      });

      // Reset form
      setEmailData({
        subject: "",
        previewText: "",
        headline: "",
        bodyContent: "",
        ctaText: "",
        ctaUrl: "",
        recipientEmails: "",
      });
    } catch (error: any) {
      console.error("Error sending marketing emails:", error);
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Email Marketing</h1>
          <p className="text-muted-foreground">
            Send promotional emails to your users.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Email Composer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Compose Email
              </CardTitle>
              <CardDescription>
                Create and send a marketing email to your users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., 🎉 Special Offer Just for You!"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previewText">Preview Text</Label>
                  <Input
                    id="previewText"
                    placeholder="Text shown in email preview (optional)"
                    value={emailData.previewText}
                    onChange={(e) => setEmailData({ ...emailData, previewText: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline">Email Headline *</Label>
                  <Input
                    id="headline"
                    placeholder="e.g., Don't Miss This Deal!"
                    value={emailData.headline}
                    onChange={(e) => setEmailData({ ...emailData, headline: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyContent">Email Body *</Label>
                  <Textarea
                    id="bodyContent"
                    placeholder="Write your email content here... (HTML supported)"
                    rows={6}
                    value={emailData.bodyContent}
                    onChange={(e) => setEmailData({ ...emailData, bodyContent: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use HTML for formatting (e.g., &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">Button Text</Label>
                    <Input
                      id="ctaText"
                      placeholder="e.g., Shop Now"
                      value={emailData.ctaText}
                      onChange={(e) => setEmailData({ ...emailData, ctaText: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaUrl">Button URL</Label>
                    <Input
                      id="ctaUrl"
                      placeholder="https://..."
                      value={emailData.ctaUrl}
                      onChange={(e) => setEmailData({ ...emailData, ctaUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Send to All Users</Label>
                      <p className="text-xs text-muted-foreground">
                        Email all registered users
                      </p>
                    </div>
                    <Switch
                      checked={sendToAll}
                      onCheckedChange={setSendToAll}
                    />
                  </div>

                  {!sendToAll && (
                    <div className="space-y-2">
                      <Label htmlFor="recipientEmails">Recipient Emails</Label>
                      <Textarea
                        id="recipientEmails"
                        placeholder="Enter emails separated by commas or new lines..."
                        rows={3}
                        value={emailData.recipientEmails}
                        onChange={(e) => setEmailData({ ...emailData, recipientEmails: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview & Stats */}
          <div className="space-y-6">
            {/* Last Send Result */}
            {lastResult && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Emails Sent Successfully</p>
                      <p className="text-sm text-green-700">
                        {lastResult.sent} delivered, {lastResult.failed} failed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <CardDescription>
                  How your email will look to recipients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  {/* Email Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center">
                    <h2 className="text-white text-xl font-bold">
                      {emailData.headline || "Your Headline Here"}
                    </h2>
                  </div>
                  
                  {/* Email Body */}
                  <div className="p-6 bg-white">
                    <div 
                      className="text-sm text-gray-600 space-y-2"
                      dangerouslySetInnerHTML={{ 
                        __html: emailData.bodyContent || "<p>Your email content will appear here...</p>" 
                      }}
                    />
                    
                    {emailData.ctaText && emailData.ctaUrl && (
                      <div className="text-center mt-6">
                        <span className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium">
                          {emailData.ctaText}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Email Footer */}
                  <div className="bg-gray-100 p-4 text-center">
                    <p className="text-xs text-gray-500">
                      © {new Date().getFullYear()} gXchange. All rights reserved.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Tips for Better Emails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Keep subject lines under 50 characters for mobile</p>
                <p>• Use a clear call-to-action button</p>
                <p>• Personalize when possible</p>
                <p>• Send at optimal times (10am-2pm)</p>
                <p>• Test with a small group first</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
