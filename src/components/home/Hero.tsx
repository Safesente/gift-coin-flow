import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Shield } from "lucide-react";
import amazonCard from "@/assets/amazon-giftcard.jpg";
import appleCard from "@/assets/apple-giftcard.png";
import starbucksCard from "@/assets/starbucks-giftcard.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero pt-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center text-center pt-16 md:pt-24 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-8 animate-fade-up">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Trusted by 50,000+ users</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl mb-6 animate-fade-up delay-100">
            Buy & Sell Gift Cards{" "}
            <span className="text-gradient-primary">Instantly</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-up delay-200">
            Trade all major gift cards with competitive rates. 
            Fast, secure, and hassle-free transactions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
            <Link to="/sell">
              <Button variant="hero" size="xl" className="w-full sm:w-auto gap-3">
                <TrendingUp className="w-5 h-5" />
                Sell Gift Cards
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/buy">
              <Button variant="gold" size="xl" className="w-full sm:w-auto gap-3">
                <TrendingDown className="w-5 h-5" />
                Buy Gift Cards
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 mt-16 pt-16 border-t border-border/50 animate-fade-up delay-400">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground mt-1">Happy Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground">100+</p>
              <p className="text-sm text-muted-foreground mt-1">Gift Card Brands</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground">&lt;1hr</p>
              <p className="text-sm text-muted-foreground mt-1">Processing</p>
            </div>
          </div>
        </div>

        {/* Floating Cards Preview */}
        <div className="relative max-w-4xl mx-auto pb-12">
          <div className="flex justify-center gap-4 md:gap-6 px-4">
            {[
              { brand: "Amazon", image: amazonCard },
              { brand: "Apple", image: appleCard },
              { brand: "Starbucks", image: starbucksCard },
            ].map((card, index) => (
              <div
                key={card.brand}
                className={`glass-card rounded-2xl p-4 md:p-6 flex-shrink-0 transition-all duration-500 hover:scale-105 hover:shadow-glow animate-fade-up`}
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden mb-3">
                  <img 
                    src={card.image} 
                    alt={`${card.brand} Gift Card`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-foreground text-center">{card.brand}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
