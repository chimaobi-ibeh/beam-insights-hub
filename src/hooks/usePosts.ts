import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PostWithAuthor {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  featured_image: string | null;
  tags: string[];
  read_time: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  authors: {
    id: string;
    name: string;
    bio: string | null;
    avatar_url: string | null;
    slug: string;
  } | null;
  categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export const usePublishedPosts = () => {
  return useQuery({
    queryKey: ["published-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id, slug, title, excerpt, body, featured_image, tags, read_time, 
          is_published, published_at, created_at,
          authors(id, name, bio, avatar_url, slug),
          categories(id, name, slug)
        `)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as PostWithAuthor[];
    },
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id, slug, title, excerpt, body, featured_image, tags, read_time, 
          is_published, published_at, created_at,
          authors(id, name, bio, avatar_url, slug),
          categories(id, name, slug)
        `)
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;
      return data as PostWithAuthor | null;
    },
    enabled: !!slug,
  });
};

export const useAuthors = () => {
  return useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};
