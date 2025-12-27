import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useGiftCards } from "@/hooks/useAdmin";

const GiftCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: giftCards = [], isLoading } = useGiftCards(false);

  const filteredCards = giftCards.filter((card) => {
    return card.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Helmet>
        <title>All Gift Cards - gXchange | {giftCards.length}+ Brands Available</title>
        <meta
          name="description"
          content="Browse all gift cards available on gXchange. Amazon, Apple, Steam, Netflix, PlayStation, Xbox, and more brands with the best rates."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                All Gift Cards
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose from {giftCards.length}+ major gift card brands. Check rates for each card.
              </p>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search gift cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Gift Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredCards.map((card) => (
                    <div
                      key={card.id}
                      className="glass-card rounded-xl p-4 group transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
                    >
                      {/* Card Icon */}
                      <div className="w-14 h-14 rounded-xl bg-background/80 border border-border/50 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 overflow-hidden">
                        {card.logo_url ? (
                          <img 
                            src={card.logo_url} 
                            alt={card.name} 
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('span')) {
                                const span = document.createElement('span');
                                span.className = 'text-xl font-bold text-foreground';
                                span.textContent = card.name.charAt(0);
                                parent.appendChild(span);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-xl font-bold text-foreground">{card.name.charAt(0)}</span>
                        )}
                      </div>

                      {/* Card Info */}
                      <h3 className="font-semibold text-foreground mb-3 truncate">{card.name}</h3>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link to={`/sell?card=${card.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                            <TrendingUp className="w-3 h-3" />
                            Sell
                          </Button>
                        </Link>
                        <Link to={`/buy?card=${card.id}`} className="flex-1">
                          <Button variant="default" size="sm" className="w-full gap-1 text-xs">
                            <TrendingDown className="w-3 h-3" />
                            Buy
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {filteredCards.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">No gift cards found matching your search.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default GiftCards;