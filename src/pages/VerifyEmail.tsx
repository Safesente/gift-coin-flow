import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const VerifyEmail = () => {
  return (
    <>
      <Helmet>
        <title>Verify Your Email - gXchange</title>
        <meta name="description" content="Please verify your email address to activate your gXchange account." />
      </Helmet>

      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              g<span className="text-primary">X</span>change
            </span>
          </Link>

          {/* Verification Card */}
          <Card className="glass-card rounded-2xl shadow-medium animate-fade-up">
            <CardContent className="pt-8 pb-8 px-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
              <p className="text-muted-foreground mb-6">
                We've sent a verification link to your email address. Please click the link to activate your account.
              </p>

              <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Next Steps:
                </h3>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Look for an email from gXchange</li>
                  <li>Click the verification link in the email</li>
                  <li>You'll be redirected to login</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Link to="/login" className="block">
                  <Button className="w-full gap-2">
                    Go to Login
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    try signing up again
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
