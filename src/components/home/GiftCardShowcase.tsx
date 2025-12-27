import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const giftCards = [
  { name: "Amazon", color: "from-orange-500 to-orange-600", letter: "A" },
  { name: "Apple / iTunes", color: "from-gray-800 to-gray-900", letter: "A" },
  { name: "Google Play", color: "from-green-500 to-green-600", letter: "G" },
  { name: "Steam", color: "from-blue-600 to-blue-700", letter: "S" },
  { name: "Netflix", color: "from-red-600 to-red-700", letter: "N" },
  { name: "PlayStation", color: "from-blue-700 to-blue-800", letter: "P" },
  { name: "Xbox", color: "from-green-600 to-green-700", letter: "X" },
  { name: "Visa Gift Card", color: "from-blue-500 to-blue-600", letter: "V" },
  { name: "Mastercard", color: "from-red-500 to-orange-500", letter: "M" },
  { name: "eBay", color: "from-yellow-500 to-red-500", letter: "E" },
  { name: "Spotify", color: "from-green-400 to-green-600", letter: "S" },
  { name: "Uber", color: "from-gray-900 to-gray-800", letter: "U" },
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
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}
              >
                <span className="text-lg font-bold text-white">{card.letter}</span>
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
