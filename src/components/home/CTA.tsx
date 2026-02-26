import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-3xl md:animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 md:w-[600px] md:h-[600px] bg-secondary/10 rounded-full blur-3xl md:animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center md:glass-card md:rounded-3xl md:p-16 md:border md:border-border/50">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">Start Trading Gift Cards Today</span>
          </div>

          <h2 className="text-3xl md:text-6xl font-bold text-foreground mb-6">
            Ready to Sell or Buy{" "}
            <span className="text-gradient-primary">Gift Cards</span>?
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join 50,000+ users who trust gXchange for fast, secure gift card exchange. 
            Sell gift cards for instant cash or buy at discounted prices. 
            Create your free account in under 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/sell-gift-cards">
              <Button variant="heroSecondary" size="xl" className="w-full sm:w-auto">
                Sell Gift Cards Now
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            ✓ No hidden fees &nbsp;&nbsp; ✓ Instant payout &nbsp;&nbsp; ✓ Secure transactions &nbsp;&nbsp; ✓ 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
