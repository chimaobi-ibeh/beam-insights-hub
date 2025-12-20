import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Trash2, ArrowLeft, Users, Plus, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

type AppRole = "admin" | "editor";

interface UserWithRoles {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  roles: AppRole[];
}

interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

const AdminPanel = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Author form state
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [authorSlug, setAuthorSlug] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [savingAuthor, setSavingAuthor] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchAuthors();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, user_id, email, full_name, created_at")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      setUsersLoading(false);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) console.error("Error fetching roles:", rolesError);

    const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => ({
      ...profile,
      roles: (roles || [])
        .filter((r) => r.user_id === profile.user_id)
        .map((r) => r.role as AppRole),
    }));

    setUsers(usersWithRoles);
    setUsersLoading(false);
  };

  const fetchAuthors = async () => {
    setAuthorsLoading(true);
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .order("name");

    if (error) console.error("Error fetching authors:", error);
    setAuthors(data || []);
    setAuthorsLoading(false);
  };

  const addRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });

    if (error) {
      toast({
        title: error.code === "23505" ? "Already assigned" : "Error",
        description: error.code === "23505" ? "User already has this role" : "Failed to add role",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: `Added ${role} role` });
      fetchUsers();
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    if (userId === user?.id && role === "admin") {
      toast({ title: "Cannot remove", description: "You cannot remove your own admin role", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);

    if (error) {
      toast({ title: "Error", description: "Failed to remove role", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Removed ${role} role` });
      fetchUsers();
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    return role === "admin" ? "destructive" : "default";
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const openAuthorDialog = (author?: Author) => {
    if (author) {
      setEditingAuthor(author);
      setAuthorName(author.name);
      setAuthorSlug(author.slug);
      setAuthorBio(author.bio || "");
      setAuthorAvatar(author.avatar_url || "");
    } else {
      setEditingAuthor(null);
      setAuthorName("");
      setAuthorSlug("");
      setAuthorBio("");
      setAuthorAvatar("");
    }
    setAuthorDialogOpen(true);
  };

  const handleAuthorNameChange = (value: string) => {
    setAuthorName(value);
    if (!editingAuthor) setAuthorSlug(generateSlug(value));
  };

  const saveAuthor = async () => {
    if (!authorName.trim() || !authorSlug.trim()) {
      toast({ title: "Error", description: "Name and slug are required", variant: "destructive" });
      return;
    }

    setSavingAuthor(true);
    const authorData = {
      name: authorName,
      slug: authorSlug,
      bio: authorBio || null,
      avatar_url: authorAvatar || null,
    };

    let error;
    if (editingAuthor) {
      const result = await supabase.from("authors").update(authorData).eq("id", editingAuthor.id);
      error = result.error;
    } else {
      const result = await supabase.from("authors").insert(authorData);
      error = result.error;
    }

    setSavingAuthor(false);

    if (error) {
      const message = error.message.includes("duplicate") ? "An author with this slug already exists" : error.message;
      toast({ title: "Error", description: message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: editingAuthor ? "Author updated" : "Author created" });
      setAuthorDialogOpen(false);
      fetchAuthors();
    }
  };

  const deleteAuthor = async (authorId: string) => {
    if (!confirm("Are you sure you want to delete this author?")) return;

    const { error } = await supabase.from("authors").delete().eq("id", authorId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete author. They may have associated posts.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Author deleted" });
      fetchAuthors();
    }
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

  if (!isAdmin) {
    return (
      <Layout>
        <div className="bg-hero-animated py-12">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-white">Admin Access Required</h1>
          </div>
        </div>
        <div className="container py-12">
          <Card className="max-w-md mx-auto shadow-card border-0">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">You need administrator privileges to access this page.</p>
              <Button asChild variant="outline">
                <Link to="/editor"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-hero-animated py-8">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/70 text-sm">Manage users, roles, and authors</p>
          </div>
          <Button asChild variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10">
            <Link to="/editor"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* User Management */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Shield className="h-5 w-5" /> User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No users found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Add Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userItem) => (
                    <TableRow key={userItem.id}>
                      <TableCell className="font-medium">{userItem.full_name || "—"}</TableCell>
                      <TableCell>{userItem.email || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {userItem.roles.length === 0 ? (
                            <span className="text-muted-foreground text-sm">No roles</span>
                          ) : (
                            userItem.roles.map((role) => (
                              <Badge
                                key={role}
                                variant={getRoleBadgeVariant(role)}
                                className="cursor-pointer group"
                                onClick={() => removeRole(userItem.user_id, role)}
                              >
                                {role}
                                <Trash2 className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(userItem.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Select onValueChange={(value) => addRole(userItem.user_id, value as AppRole)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Add role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Author Management */}
        <Card className="shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display flex items-center gap-2">
              <Users className="h-5 w-5" /> Author Management
            </CardTitle>
            <Dialog open={authorDialogOpen} onOpenChange={setAuthorDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => openAuthorDialog()}>
                  <Plus className="h-4 w-4 mr-2" /> Add Author
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAuthor ? "Edit Author" : "Add Author"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="author-name">Name</Label>
                    <Input id="author-name" value={authorName} onChange={(e) => handleAuthorNameChange(e.target.value)} placeholder="Author name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author-slug">Slug</Label>
                    <Input id="author-slug" value={authorSlug} onChange={(e) => setAuthorSlug(e.target.value)} placeholder="author-slug" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author-bio">Bio</Label>
                    <Textarea id="author-bio" value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} placeholder="Short bio about the author" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author-avatar">Avatar URL</Label>
                    <Input id="author-avatar" value={authorAvatar} onChange={(e) => setAuthorAvatar(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAuthorDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveAuthor} disabled={savingAuthor}>{savingAuthor ? "Saving..." : "Save"}</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {authorsLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading authors...</p>
            ) : authors.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No authors found. Add one to get started.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Bio</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authors.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell className="font-medium">{author.name}</TableCell>
                      <TableCell className="text-muted-foreground">{author.slug}</TableCell>
                      <TableCell className="max-w-xs truncate">{author.bio || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openAuthorDialog(author)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteAuthor(author.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
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

        {/* Role descriptions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <Badge variant="destructive" className="mb-2">Admin</Badge>
              <p className="text-sm text-muted-foreground">
                Full access to all features including user management, role assignment, author management, and content management.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <Badge variant="default" className="mb-2">Editor</Badge>
              <p className="text-sm text-muted-foreground">
                Can create, edit, and delete blog posts and categories. Cannot manage users, roles, or authors.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
