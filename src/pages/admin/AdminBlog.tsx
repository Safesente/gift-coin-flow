import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Eye, EyeOff, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  category_id: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

const AdminBlog = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const { data: posts, isLoading: postsLoading } = useQuery({
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

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as BlogCategory[];
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

  // Category mutations
  const saveCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!categoryName.trim() || !categorySlug.trim()) {
        throw new Error("Name and slug are required");
      }

      const categoryData = {
        name: categoryName.trim(),
        slug: categorySlug.trim(),
        description: categoryDescription.trim() || null,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("blog_categories")
          .update(categoryData)
          .eq("id", editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_categories").insert(categoryData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      toast.success(editingCategory ? "Category updated" : "Category created");
      closeCategoryDialog();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      toast.success("Category deleted");
      setDeleteCategoryId(null);
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleCategoryNameChange = (value: string) => {
    setCategoryName(value);
    if (!editingCategory) {
      setCategorySlug(generateSlug(value));
    }
  };

  const openCategoryDialog = (category?: BlogCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategorySlug(category.slug);
      setCategoryDescription(category.description || "");
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setCategorySlug("");
      setCategoryDescription("");
    }
    setIsCategoryDialogOpen(true);
  };

  const closeCategoryDialog = () => {
    setIsCategoryDialogOpen(false);
    setEditingCategory(null);
    setCategoryName("");
    setCategorySlug("");
    setCategoryDescription("");
  };

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

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId || !categories) return null;
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts and categories</p>
        </div>
      </div>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleNewPost} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> New Post
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : posts && posts.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
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
                              {getCategoryName(post.category_id) ? (
                                <Badge variant="outline">{getCategoryName(post.category_id)}</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={post.is_published ? "default" : "secondary"}>
                                {post.is_published ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(post.created_at), "MMM dd, yyyy")}
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
                          {getCategoryName(post.category_id) && (
                            <Badge variant="outline" className="mb-2">
                              {getCategoryName(post.category_id)}
                            </Badge>
                          )}
                          <p className="text-sm text-muted-foreground mb-4">
                            Created: {format(new Date(post.created_at), "MMM dd, yyyy")}
                          </p>
                          <div className="flex flex-wrap gap-2">
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
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openCategoryDialog()} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> New Category
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : categories && categories.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <Card key={category.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">{category.name}</h3>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openCategoryDialog(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setDeleteCategoryId(category.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">/blog/category/{category.slug}</p>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No categories yet. Create your first category!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={categoryName}
                onChange={(e) => handleCategoryNameChange(e.target.value)}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={categorySlug}
                onChange={(e) => setCategorySlug(generateSlug(e.target.value))}
                placeholder="category-slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description (optional)</Label>
              <Input
                id="cat-desc"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={closeCategoryDialog}>
                Cancel
              </Button>
              <Button
                onClick={() => saveCategoryMutation.mutate()}
                disabled={saveCategoryMutation.isPending}
              >
                {saveCategoryMutation.isPending ? "Saving..." : editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Post Confirmation */}
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

      {/* Delete Category Confirmation */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Posts using this category will have no category assigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCategoryId && deleteCategoryMutation.mutate(deleteCategoryId)}
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