import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import BlogEditor from "@/components/admin/BlogEditor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const AdminBlog = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post deleted successfully");
      setDeletePostId(null);
    },
    onError: (error) => {
      toast.error("Failed to delete blog post");
      console.error(error);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          is_published: !isPublished,
          published_at: !isPublished ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Post status updated");
    },
    onError: (error) => {
      toast.error("Failed to update post status");
      console.error(error);
    },
  });

  const handleNewPost = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        <Button onClick={handleNewPost} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : posts && posts.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {post.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.is_published ? "default" : "secondary"}>
                            {post.is_published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(post.created_at), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {post.published_at
                            ? format(new Date(post.published_at), "MMM dd, yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                togglePublishMutation.mutate({
                                  id: post.id,
                                  isPublished: post.is_published,
                                })
                              }
                              title={post.is_published ? "Unpublish" : "Publish"}
                            >
                              {post.is_published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPost(post)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletePostId(post.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-foreground line-clamp-2 flex-1 mr-2">
                          {post.title}
                        </h3>
                        <Badge variant={post.is_published ? "default" : "secondary"}>
                          {post.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Created: {format(new Date(post.created_at), "MMM dd, yyyy")}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            togglePublishMutation.mutate({
                              id: post.id,
                              isPublished: post.is_published,
                            })
                          }
                        >
                          {post.is_published ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                          {post.is_published ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletePostId(post.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No blog posts yet. Create your first post!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blog Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          <BlogEditor
            post={editingPost}
            onClose={handleEditorClose}
            userId={user?.id || ""}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && deleteMutation.mutate(deletePostId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBlog;
