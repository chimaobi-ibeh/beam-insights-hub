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
        .order("published_at", { ascending: false, nullsFirst: false });

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

export const useCategoriesWithPostCount = () => {
  return useQuery({
    queryKey: ["categories-with-post-count"],
    queryFn: async () => {
      // Get all categories
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (catError) throw catError;

      // Get all published posts with their category_id
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("id, category_id")
        .eq("is_published", true);

      if (postsError) throw postsError;

      // Count posts per category
      const categoriesWithCount = categories?.map(category => ({
        ...category,
        postCount: posts?.filter(post => post.category_id === category.id).length || 0
      }));

      return categoriesWithCount;
    },
  });
};

export const usePostsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ["posts-by-category", categorySlug],
    queryFn: async () => {
      // First get the category ID from slug
      const { data: category, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (catError) throw catError;
      if (!category) return { category: null, posts: [] };

      // Then get posts for that category
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select(`
          id, slug, title, excerpt, body, featured_image, tags, read_time, 
          is_published, published_at, created_at,
          authors(id, name, bio, avatar_url, slug),
          categories(id, name, slug)
        `)
        .eq("category_id", category.id)
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false });

      if (postsError) throw postsError;

      return { category, posts: posts as PostWithAuthor[] };
    },
    enabled: !!categorySlug,
  });
};

export const useAuthorsWithPostCount = () => {
  return useQuery({
    queryKey: ["authors-with-post-count"],
    queryFn: async () => {
      // Get all authors
      const { data: authors, error: authorsError } = await supabase
        .from("authors")
        .select("*")
        .order("name");

      if (authorsError) throw authorsError;

      // Get all published posts with their author_id
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("id, author_id")
        .eq("is_published", true);

      if (postsError) throw postsError;

      // Count posts per author
      const authorsWithCount = authors?.map(author => ({
        ...author,
        postCount: posts?.filter(post => post.author_id === author.id).length || 0
      }));

      return authorsWithCount;
    },
  });
};
