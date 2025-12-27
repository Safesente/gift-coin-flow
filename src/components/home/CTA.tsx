import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">Start Trading Today</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Trade Your{" "}
            <span className="text-gradient-primary">Gift Cards</span>?
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust gXchange for fast, secure, and reliable gift card transactions. 
            Create your free account in under 2 minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="heroSecondary" size="xl" className="w-full sm:w-auto">
                I Already Have an Account
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-muted-foreground mt-8">
            ✓ No hidden fees &nbsp;&nbsp; ✓ Secure transactions &nbsp;&nbsp; ✓ 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
