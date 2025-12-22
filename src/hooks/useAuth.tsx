import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "editor" | "user";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  isAdmin: boolean;
  isEditor: boolean;
  isLoading: boolean;
  rolesLoaded: boolean;
  isHydrated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, email, full_name")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      setProfile({
        id: data.id,
        user_id: data.user_id,
        email: data.email,
        full_name: data.full_name,
      });
    }
  };

  const fetchRoles = async (userId: string) => {
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);

    if (!error && data) {
      setRoles(data.map((r) => r.role as AppRole));
    } else {
      setRoles([]);
    }

    setRolesLoaded(true);
  };

  const hydrateUserData = async (u: User) => {
    setRolesLoaded(false);
    await Promise.all([fetchProfile(u.id), fetchRoles(u.id)]);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Ensure we don't show "Access Denied" while roles are still loading
        setRolesLoaded(false);
        setTimeout(() => {
          fetchProfile(session.user.id);
          fetchRoles(session.user.id);
        }, 0);
      } else {
        setProfile(null);
        setRoles([]);
        setRolesLoaded(true);
      }
    });

    // THEN check for existing session
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await hydrateUserData(session.user);
        } else {
          setRolesLoaded(true);
        }

        setIsLoading(false);
      })
      .catch(() => {
        setRolesLoaded(true);
        setIsLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setRoles([]);
    setRolesLoaded(true);
  };

  const isAdmin = roles.includes("admin");
  const isEditor = isAdmin || roles.includes("editor");
  const isHydrated = !isLoading && (!user || rolesLoaded);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        isAdmin,
        isEditor,
        isLoading,
        rolesLoaded,
        isHydrated,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
