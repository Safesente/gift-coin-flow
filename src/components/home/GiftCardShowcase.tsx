import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const giftCards = [
  { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
  { name: "Apple / iTunes", logo: "https://logo.clearbit.com/apple.com" },
  { name: "Google Play", logo: "https://logo.clearbit.com/play.google.com" },
  { name: "Steam", logo: "https://logo.clearbit.com/steampowered.com" },
  { name: "Netflix", logo: "https://logo.clearbit.com/netflix.com" },
  { name: "PlayStation", logo: "https://logo.clearbit.com/playstation.com" },
  { name: "Xbox", logo: "https://logo.clearbit.com/xbox.com" },
  { name: "Visa Gift Card", logo: "https://logo.clearbit.com/visa.com" },
  { name: "Mastercard", logo: "https://logo.clearbit.com/mastercard.com" },
  { name: "eBay", logo: "https://logo.clearbit.com/ebay.com" },
  { name: "Spotify", logo: "https://logo.clearbit.com/spotify.com" },
  { name: "Uber", logo: "https://logo.clearbit.com/uber.com" },
];

const GiftCardShowcase = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Supported Cards
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            50+ Gift Cards Supported
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trade all major gift card brands with competitive rates and instant processing.
          </p>
        </div>

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {giftCards.map((card, index) => (
            <div
              key={card.name}
              className="glass-card rounded-xl p-4 group cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-background/80 border border-border/50 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 overflow-hidden">
                <img 
                  src={card.logo} 
                  alt={card.name} 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('span')) {
                      const span = document.createElement('span');
                      span.className = 'text-lg font-bold text-foreground';
                      span.textContent = card.name.charAt(0);
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
              <p className="text-sm font-medium text-foreground truncate">{card.name}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/gift-cards">
            <Button variant="outline" size="lg" className="gap-2">
              View All Gift Cards
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GiftCardShowcase;
