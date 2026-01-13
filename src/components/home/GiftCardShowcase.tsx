import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { usePublicGiftCards } from "@/hooks/useAdmin";
import giftCardIcon from "@/assets/gift-card-icon.jpeg";

const GiftCardShowcase = () => {
  const { data: giftCards = [], isLoading } = usePublicGiftCards();
  
  // Show first 12 cards on homepage
  const displayCards = giftCards.slice(0, 12);

  if (isLoading) {
    return (
      <section className="py-24">
        <div className="container mx-auto flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Supported Cards
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {giftCards.length}+ Gift Cards Supported
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trade all major gift card brands with competitive rates and instant processing.
          </p>
        </div>

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {displayCards.map((card) => (
            <Link
              key={card.id}
              to={`/sell?card=${card.id}`}
              className="glass-card rounded-xl p-4 group cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1 block"
            >
              <div className="w-12 h-12 rounded-xl bg-background/80 border border-border/50 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 overflow-hidden">
                {card.logo_url ? (
                  <img 
                    src={card.logo_url} 
                    alt={card.name} 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = giftCardIcon;
                      target.className = 'w-6 h-6 object-contain [filter:invert(42%)_sepia(93%)_saturate(1352%)_hue-rotate(87deg)_brightness(95%)_contrast(101%)]';
                    }}
                  />
                ) : (
                  <img src={giftCardIcon} alt="Gift card" className="w-6 h-6 object-contain [filter:invert(42%)_sepia(93%)_saturate(1352%)_hue-rotate(87deg)_brightness(95%)_contrast(101%)]" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground truncate">{card.name}</p>
            </Link>
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