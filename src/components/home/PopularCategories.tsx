import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicCategories } from "@/hooks/useAdmin";

const PopularCategories = () => {
  const { data: categories = [], isLoading } = usePublicCategories();
  if (!isLoading && categories.length === 0) return null;
  return (
    <section className="home-section">
      <div className="container">
        <div className="home-section-header"><div><p className="home-label">Find your next favourite</p><h2 className="home-heading">Popular categories.</h2></div><Link to="/gift-cards" className="home-text-link">Explore all <ArrowUpRight className="h-4 w-4" /></Link></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] rounded-md" />) : categories.map(category => (
            <Link key={category.id} to={`/gift-cards?category=${category.slug}`} className="group min-w-0">
              <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-muted">{category.featured_image ? <img src={category.featured_image} alt={category.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center text-primary text-4xl font-semibold">{category.name.charAt(0)}</div>}</div>
              <div className="flex justify-between items-center gap-2 mt-4"><h3 className="font-semibold text-sm md:text-lg break-words">{category.name}</h3><ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PopularCategories;
