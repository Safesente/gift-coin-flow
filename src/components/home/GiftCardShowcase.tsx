import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicGiftCards } from "@/hooks/useAdmin";

const GiftCardShowcase = () => {
  const { data: giftCards = [], isLoading } = usePublicGiftCards();
  return (
    <section className="home-section">
      <div className="container">
        <div className="home-section-header"><div><p className="home-label">The brands you know</p><h2 className="home-heading">A card for every occasion.</h2></div><Link to="/gift-cards" className="home-text-link">View all gift cards <ArrowUpRight className="h-4 w-4" /></Link></div>
        <p className="text-muted-foreground mb-8">{isLoading ? 'Explore our gift card collection.' : `${giftCards.length}+ gift cards. Choose a brand to start trading.`}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-8">
          {isLoading ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-md" />) : giftCards.slice(0, 12).map(card => <Link key={card.id} to={`/sell?card=${card.id}`} className="group min-w-0"><div className="home-brand-image">{card.logo_url ? <img src={card.logo_url} alt={card.name} loading="lazy" className="h-20 w-20 object-contain" onError={e => { e.currentTarget.style.display = 'none'; }} /> : <span className="text-3xl font-bold text-primary">{card.name.charAt(0)}</span>}</div><div className="flex items-center justify-between gap-2 mt-3"><p className="text-sm font-medium break-words">{card.name}</p><ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary" /></div></Link>)}
        </div>
      </div>
    </section>
  );
};
export default GiftCardShowcase;
