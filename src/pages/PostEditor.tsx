import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const { user, isEditor, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState(5);
  const [isPublished, setIsPublished] = useState(false);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [postLoading, setPostLoading] = useState(!isNew);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (isEditor) {
      fetchAuthors();
      fetchCategories();
      if (!isNew && id) {
        fetchPost(id);
      }
    }
  }, [isEditor, id, isNew]);

  const fetchAuthors = async () => {
    const { data } = await supabase.from("authors").select("id, name").order("name");
    setAuthors(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name").order("name");
    setCategories(data || []);
  };

  const fetchPost = async (postId: string) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .maybeSingle();

    if (error || !data) {
      toast({ title: "Error", description: "Post not found", variant: "destructive" });
      navigate("/editor");
      return;
    }

    setTitle(data.title);
    setSlug(data.slug);
    setExcerpt(data.excerpt || "");
    setBody(data.body || "");
    setFeaturedImage(data.featured_image || "");
    setAuthorId(data.author_id || "");
    setCategoryId(data.category_id || "");
    setTags((data.tags || []).join(", "));
    setReadTime(data.read_time || 5);
    setIsPublished(data.is_published);
    setPostLoading(false);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isNew) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }
    if (!slug.trim()) {
      toast({ title: "Error", description: "Slug is required", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    const postData = {
      title,
      slug,
      excerpt: excerpt || null,
      body: body || null,
      featured_image: featuredImage || null,
      author_id: authorId || null,
      category_id: categoryId || null,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      read_time: readTime,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    let error;
    if (isNew) {
      const result = await supabase.from("posts").insert(postData).select().single();
      error = result.error;
      if (!error && result.data) {
        navigate(`/editor/post/${result.data.id}`);
      }
    } else {
      const result = await supabase.from("posts").update(postData).eq("id", id);
      error = result.error;
    }

    setIsSaving(false);

    if (error) {
      const message = error.message.includes("duplicate")
        ? "A post with this slug already exists"
        : error.message;
      toast({ title: "Error", description: message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: isNew ? "Post created!" : "Post updated!" });
    }
  };

  if (isLoading || postLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!isEditor) {
    navigate("/editor");
    return null;
  }

  return (
    <Layout>
      <div className="bg-hero py-6">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/editor")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-xl font-bold text-white">
              {isNew ? "New Post" : "Edit Post"}
            </h1>
          </div>
          <div className="flex gap-2">
            {!isNew && isPublished && (
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
                onClick={() => window.open(`/post/${slug}`, "_blank")}
              >
                <Eye className="h-4 w-4 mr-2" /> Preview
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-accent hover:bg-accent/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="font-display text-lg">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="post-url-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the post"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Body</Label>
                  <RichTextEditor
                    content={body}
                    onChange={setBody}
                    placeholder="Write your post content here..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="font-display text-lg">Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Published</Label>
                  <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="font-display text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featured-image">Featured Image URL</Label>
                  <Input
                    id="featured-image"
                    placeholder="https://..."
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Select value={authorId} onValueChange={setAuthorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="AI, Data Analytics, BI"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="read-time">Read Time (minutes)</Label>
                  <Input
                    id="read-time"
                    type="number"
                    min="1"
                    value={readTime}
                    onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostEditor;
