import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { usePostsByCategory } from "@/hooks/usePosts";
import PostCard from "@/components/blog/PostCard";
import { ArrowLeft } from "lucide-react";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = usePostsByCategory(slug || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data?.category) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link to="/categories" className="text-accent hover:underline">
            Browse all categories
          </Link>
        </div>
      </Layout>
    );
  }

  const { category, posts } = data;

  return (
    <Layout>
      <div className="bg-hero-animated py-16">
        <div className="container">
          <Link 
            to="/categories" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Categories
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-white/80">
            {posts.length} {posts.length === 1 ? "article" : "articles"} in this category
          </p>
        </div>
      </div>

      <section className="container py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles in this category yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt || ""}
                author={{
                  name: post.authors?.name || "Unknown Author",
                  avatar: post.authors?.avatar_url || undefined,
                }}
                featuredImage={post.featured_image || undefined}
                tags={post.tags || []}
                publishedAt={post.published_at || post.created_at}
                readTime={post.read_time || 5}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CategoryPage;
