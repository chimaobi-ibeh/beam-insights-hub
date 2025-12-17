import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserPlus, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type AppRole = "admin" | "editor" | "user";

interface UserWithRoles {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  roles: AppRole[];
}

const AdminPanel = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setUsersLoading(true);

    // Fetch all profiles (admins can see all)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, user_id, email, full_name, created_at")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      setUsersLoading(false);
      return;
    }

    // Fetch all roles
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
    }

    // Combine profiles with roles
    const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => ({
      ...profile,
      roles: (roles || [])
        .filter((r) => r.user_id === profile.user_id)
        .map((r) => r.role as AppRole),
    }));

    setUsers(usersWithRoles);
    setUsersLoading(false);
  };

  const addRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: role,
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already assigned",
          description: "User already has this role",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add role",
          variant: "destructive",
        });
      }
    } else {
      toast({ title: "Success", description: `Added ${role} role` });
      fetchUsers();
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    // Prevent removing your own admin role
    if (userId === user?.id && role === "admin") {
      toast({
        title: "Cannot remove",
        description: "You cannot remove your own admin role",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: `Removed ${role} role` });
      fetchUsers();
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "editor":
        return "default";
      default:
        return "secondary";
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
        <div className="bg-hero py-12">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-white">
              Admin Access Required
            </h1>
          </div>
        </div>
        <div className="container py-12">
          <Card className="max-w-md mx-auto shadow-card border-0">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                You need administrator privileges to access this page.
              </p>
              <Button asChild variant="outline">
                <Link to="/editor">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Link>
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
              Admin Panel
            </h1>
            <p className="text-white/70 text-sm">Manage users and roles</p>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            <Link to="/editor">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Shield className="h-5 w-5" /> User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <p className="text-center py-8 text-muted-foreground">
                Loading users...
              </p>
            ) : users.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No users found.
              </p>
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
                      <TableCell className="font-medium">
                        {userItem.full_name || "—"}
                      </TableCell>
                      <TableCell>{userItem.email || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {userItem.roles.length === 0 ? (
                            <span className="text-muted-foreground text-sm">
                              No roles
                            </span>
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
                      <TableCell>
                        {new Date(userItem.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          onValueChange={(value) =>
                            addRole(userItem.user_id, value as AppRole)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Add role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="user">User</SelectItem>
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

        {/* Role descriptions */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <Badge variant="destructive" className="mb-2">
                Admin
              </Badge>
              <p className="text-sm text-muted-foreground">
                Full access to all features including user management, role
                assignment, and content management.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <Badge variant="default" className="mb-2">
                Editor
              </Badge>
              <p className="text-sm text-muted-foreground">
                Can create, edit, and delete blog posts, authors, and categories.
                Cannot manage users or roles.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <Badge variant="secondary" className="mb-2">
                User
              </Badge>
              <p className="text-sm text-muted-foreground">
                Basic user access. Can view public content but cannot access the
                editor dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
