import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { giftCards, categories } from "@/data/giftCards";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

const GiftCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCards = giftCards.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>All Gift Cards - gXchange | 50+ Brands Available</title>
        <meta
          name="description"
          content="Browse all gift cards available on gXchange. Amazon, Apple, Steam, Netflix, PlayStation, Xbox, and 50+ more brands with the best rates."
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
                Choose from 50+ major gift card brands. Sell at 47% value or buy at 85%.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search */}
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

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Gift Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="glass-card rounded-xl p-4 group transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
                >
                  {/* Card Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <span className="text-xl font-bold text-white">{card.letter}</span>
                  </div>

                  {/* Card Info */}
                  <h3 className="font-semibold text-foreground mb-1 truncate">{card.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{card.category}</p>

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
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default GiftCards;
