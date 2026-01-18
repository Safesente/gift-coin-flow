import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Calendar, User, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
}

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at, created_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  return (
    <>
      <Helmet>
        <title>Blog - GXchange</title>
        <meta name="description" content="Read our latest articles about gift cards, crypto, and digital payments." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Blog
              </h1>
              <p className="text-muted-foreground text-lg">
                Latest news, tips, and insights about gift cards and digital payments
              </p>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
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
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
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
                  No blog posts yet. Check back soon!
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
