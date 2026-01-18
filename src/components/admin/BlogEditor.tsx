import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  BarChart3,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  is_published: boolean;
  category_id: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogEditorProps {
  post: BlogPost | null;
  onClose: () => void;
  userId: string;
}

const BlogEditor = ({ post, onClose, userId }: BlogEditorProps) => {
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || "");
  const [categoryId, setCategoryId] = useState(post?.category_id || "");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [chartData, setChartData] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Fetch categories
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

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!post) {
      setSlug(generateSlug(value));
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const insertHeading = (level: number) => {
    execCommand("formatBlock", `h${level}`);
  };

  const insertLink = () => {
    if (linkUrl) {
      const text = linkText || linkUrl;
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-primary underline">${text}</a>`;
      execCommand("insertHTML", linkHtml);
      setLinkUrl("");
      setLinkText("");
    }
  };

  const insertImage = () => {
    if (imageUrl) {
      const imgHtml = `<img src="${imageUrl}" alt="Blog image" class="max-w-full h-auto rounded-lg my-4" />`;
      execCommand("insertHTML", imgHtml);
      setImageUrl("");
    }
  };

  const insertChart = () => {
    if (chartData) {
      const chartHtml = `
        <div class="my-6 p-4 bg-muted rounded-lg">
          <p class="text-sm text-muted-foreground mb-2">Chart: ${chartData}</p>
          <div class="flex items-end gap-2 h-32">
            <div class="bg-primary w-8" style="height: 60%"></div>
            <div class="bg-primary w-8" style="height: 80%"></div>
            <div class="bg-primary w-8" style="height: 45%"></div>
            <div class="bg-primary w-8" style="height: 90%"></div>
            <div class="bg-primary w-8" style="height: 70%"></div>
          </div>
        </div>
      `;
      execCommand("insertHTML", chartHtml);
      setChartData("");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("public")
        .getPublicUrl(filePath);

      setFeaturedImage(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFeaturedImage = () => {
    setFeaturedImage("");
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const content = contentRef.current?.innerHTML || "";

      if (!title.trim() || !slug.trim() || !content.trim()) {
        throw new Error("Title, slug, and content are required");
      }

      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        excerpt: excerpt.trim() || null,
        featured_image: featuredImage.trim() || null,
        category_id: categoryId || null,
        author_id: userId,
      };

      if (post) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(postData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success(post ? "Post updated successfully" : "Post created successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save post");
    },
  });

  const ToolbarButton = ({
    onClick,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    icon: React.ElementType;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      title={title}
      className="h-8 w-8"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter blog post title"
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">/blog/</span>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            placeholder="url-slug"
            className="flex-1"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No category</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Featured Image Upload */}
      <div className="space-y-2">
        <Label>Featured Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {featuredImage ? (
          <div className="relative inline-block">
            <img
              src={featuredImage}
              alt="Featured preview"
              className="max-h-48 rounded-lg object-cover border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={removeFeaturedImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm text-muted-foreground">or</span>
              <Input
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt (optional)</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary of the blog post"
          rows={2}
        />
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <Label>Content</Label>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border rounded-t-lg bg-muted/50">
          {/* Headings */}
          <ToolbarButton onClick={() => insertHeading(1)} icon={Heading1} title="Heading 1" />
          <ToolbarButton onClick={() => insertHeading(2)} icon={Heading2} title="Heading 2" />
          <ToolbarButton onClick={() => insertHeading(3)} icon={Heading3} title="Heading 3" />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Formatting */}
          <ToolbarButton onClick={() => execCommand("bold")} icon={Bold} title="Bold" />
          <ToolbarButton onClick={() => execCommand("italic")} icon={Italic} title="Italic" />
          <ToolbarButton onClick={() => execCommand("underline")} icon={Underline} title="Underline" />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <ToolbarButton onClick={() => execCommand("insertUnorderedList")} icon={List} title="Bullet List" />
          <ToolbarButton onClick={() => execCommand("insertOrderedList")} icon={ListOrdered} title="Numbered List" />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Alignment */}
          <ToolbarButton onClick={() => execCommand("justifyLeft")} icon={AlignLeft} title="Align Left" />
          <ToolbarButton onClick={() => execCommand("justifyCenter")} icon={AlignCenter} title="Align Center" />
          <ToolbarButton onClick={() => execCommand("justifyRight")} icon={AlignRight} title="Align Right" />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Quote & Code */}
          <ToolbarButton onClick={() => execCommand("formatBlock", "blockquote")} icon={Quote} title="Quote" />
          <ToolbarButton onClick={() => execCommand("formatBlock", "pre")} icon={Code} title="Code Block" />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Link */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Insert Link">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="link-text">Link Text</Label>
                  <Input
                    id="link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Display text"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <Button onClick={insertLink} size="sm" className="w-full">
                  Insert Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Image */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Insert Image">
                <Image className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button onClick={insertImage} size="sm" className="w-full">
                  Insert Image
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Chart */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Insert Chart">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="chart-data">Chart Title/Description</Label>
                  <Input
                    id="chart-data"
                    value={chartData}
                    onChange={(e) => setChartData(e.target.value)}
                    placeholder="e.g., Monthly Sales Data"
                  />
                </div>
                <Button onClick={insertChart} size="sm" className="w-full">
                  Insert Chart
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Editable Content Area */}
        <div
          ref={contentRef}
          contentEditable
          className="min-h-[300px] p-4 border border-t-0 rounded-b-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post?.content || "" }}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="w-full sm:w-auto"
        >
          {saveMutation.isPending ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </div>
  );
};

export default BlogEditor;