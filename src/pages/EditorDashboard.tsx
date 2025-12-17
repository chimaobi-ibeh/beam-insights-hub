import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, LogOut, FileText, Users, FolderOpen, Shield } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  authors: { name: string } | null;
}

const EditorDashboard = () => {
  const { user, profile, isEditor, isAdmin, isLoading, signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, authors: 0, categories: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (isEditor) {
      fetchPosts();
      fetchStats();
    }
  }, [isEditor]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, is_published, published_at, created_at, authors(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
    setPostsLoading(false);
  };

  const fetchStats = async () => {
    const [postsRes, authorsRes, categoriesRes] = await Promise.all([
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("authors").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
    ]);

    setStats({
      posts: postsRes.count || 0,
      authors: authorsRes.count || 0,
      categories: categoriesRes.count || 0,
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Post deleted successfully" });
      fetchPosts();
      fetchStats();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!isEditor) {
    return (
      <Layout>
        <div className="bg-hero py-12">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-white">Access Denied</h1>
          </div>
        </div>
        <div className="container py-12">
          <Card className="max-w-md mx-auto shadow-card border-0">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                You don't have editor access. Contact an administrator to get access.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Logged in as: {profile?.email || user?.email}
              </p>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-hero py-8">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              Editor Dashboard
            </h1>
            <p className="text-white/70 text-sm">Welcome, {profile?.full_name || "Editor"}</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button asChild variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                <Link to="/admin">
                  <Shield className="h-4 w-4 mr-2" /> Admin Panel
                </Link>
              </Button>
            )}
            <Button onClick={handleSignOut} variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card border-0">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.posts}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.authors}</p>
                <p className="text-sm text-muted-foreground">Authors</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <FolderOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.categories}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Table */}
        <Card className="shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Posts</CardTitle>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link to="/editor/post/new">
                <Plus className="h-4 w-4 mr-2" /> New Post
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No posts yet. Create your first post!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.authors?.name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={post.is_published ? "default" : "secondary"}>
                          {post.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(post.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {post.is_published && (
                            <Button asChild variant="ghost" size="icon">
                              <Link to={`/post/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button asChild variant="ghost" size="icon">
                            <Link to={`/editor/post/${post.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(post.id, post.title)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditorDashboard;
