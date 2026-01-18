import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Calendar, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      return data as BlogPostData;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-64 w-full rounded-lg mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-48 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - GXchange Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <article className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>

            {post.featured_image && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.published_at || post.created_at), "MMMM dd, yyyy")}
              </span>
            </div>

            <div 
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-foreground prose-p:text-muted-foreground
                prose-a:text-primary prose-strong:text-foreground
                prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
