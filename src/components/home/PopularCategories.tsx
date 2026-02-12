import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicCategories } from "@/hooks/useAdmin";

const PopularCategories = () => {
  const { data: categories = [], isLoading } = usePublicCategories();

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-8 md:mb-10">
          Popular categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] md:aspect-[16/10] rounded-2xl md:rounded-3xl" />
              ))
            : categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/gift-cards?category=${category.slug}`}
                  className="group relative aspect-[4/3] md:aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden block"
                >
                  {category.featured_image ? (
                    <img
                      src={category.featured_image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 flex items-end justify-between">
                    <h3 className="text-sm md:text-xl font-bold text-white leading-tight">
                      {category.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white/80 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
