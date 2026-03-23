import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Shield } from "lucide-react";
import amazonCard from "@/assets/amazon-giftcard.jpg";
import appleCard from "@/assets/apple-giftcard.png";
import starbucksCard from "@/assets/starbucks-giftcard.jpg";

const Hero = () => {
  return (
    <section className="relative bg-background pt-20 overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:gap-16 pt-16 md:pt-28 pb-16">
          {/* Left column - Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left md:flex-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted mb-8 animate-fade-up">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Trusted by 50,000+ users</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-foreground max-w-4xl mb-6 animate-fade-up delay-100 md:leading-[0.95]">
              Buy & Sell{" "}
              <br className="hidden md:block" />
              Gift Cards{" "}
              <br className="hidden md:block" />
              <span className="text-primary">Instantly</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-lg mb-10 animate-fade-up delay-200">
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
            <div className="grid grid-cols-3 gap-8 md:gap-12 mt-16 pt-8 border-t border-border animate-fade-up delay-400">
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-5xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground mt-1">Happy Users</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-5xl font-bold text-foreground">100+</p>
                <p className="text-sm text-muted-foreground mt-1">Gift Card Brands</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-5xl font-bold text-foreground">&lt;1hr</p>
                <p className="text-sm text-muted-foreground mt-1">Processing</p>
              </div>
            </div>
          </div>

          {/* Right column - Cards */}
          <div className="relative md:flex-1 mt-12 md:mt-0">
            {/* Mobile */}
            <div className="flex md:hidden justify-center gap-4 px-4">
              {[
                { brand: "Amazon", image: amazonCard },
                { brand: "Apple", image: appleCard },
                { brand: "Starbucks", image: starbucksCard },
              ].map((card, index) => (
                <div
                  key={card.brand}
                  className="bg-card border border-border rounded-2xl p-4 flex-shrink-0 transition-all duration-300 hover:border-primary animate-fade-up"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden mb-3">
                    <img src={card.image} alt={`${card.brand} Gift Card`} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-medium text-foreground text-center">{card.brand}</p>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block relative h-[520px]">
              {[
                { brand: "Amazon", image: amazonCard, rotate: "-6deg", x: "10%", y: "5%" },
                { brand: "Apple", image: appleCard, rotate: "3deg", x: "30%", y: "15%" },
                { brand: "Starbucks", image: starbucksCard, rotate: "-2deg", x: "20%", y: "35%" },
              ].map((card, index) => (
                <div
                  key={card.brand}
                  className="absolute bg-card border border-border rounded-3xl p-8 transition-all duration-500 hover:border-primary hover:z-10 cursor-pointer animate-fade-up"
                  style={{
                    transform: `rotate(${card.rotate})`,
                    left: card.x,
                    top: card.y,
                    animationDelay: `${500 + index * 150}ms`,
                  }}
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden mb-4">
                    <img src={card.image} alt={`${card.brand} Gift Card`} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-base font-semibold text-foreground text-center">{card.brand}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
