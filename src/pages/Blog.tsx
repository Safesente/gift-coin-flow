import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  category_id: string | null;
}

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("id, name, slug")
        .order("name");

      if (error) throw error;
      return data as BlogCategory[];
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at, created_at, category_id")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId || !categories) return null;
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || null;
  };

  return (
    <>
      <Helmet>
        <title>Blog - GXchange</title>
        <meta name="description" content="Read our latest articles about gift cards, crypto, and digital payments." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 mt-16 md:mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Blog
              </h1>
              <p className="text-muted-foreground text-lg">
                Latest news, tips, and insights about gift cards and digital payments
              </p>
            </div>

            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {category.name}
                  </Button>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-grow">
                      {getCategoryName(post.category_id) && (
                        <Badge variant="secondary" className="w-fit mb-2">
                          <Tag className="h-3 w-3 mr-1" />
                          {getCategoryName(post.category_id)}
                        </Badge>
                      )}
                      <Link to={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      {post.excerpt && (
                        <p className="text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.published_at || post.created_at), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" asChild className="ml-auto">
                        <Link to={`/blog/${post.slug}`}>
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {selectedCategory ? "No posts in this category yet." : "No blog posts yet. Check back soon!"}
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;