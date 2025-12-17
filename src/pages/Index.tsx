import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/blog/HeroSection";
import PostCard from "@/components/blog/PostCard";
import { usePublishedPosts, PostWithAuthor } from "@/hooks/usePosts";
import { posts as mockPosts, Post as MockPost } from "@/data/mockPosts";

const Index = () => {
  const { data: dbPosts, isLoading } = usePublishedPosts();

  // Use database posts if available, otherwise fall back to mock data
  const hasDbPosts = dbPosts && dbPosts.length > 0;

  const renderDbPost = (post: PostWithAuthor, featured = false) => (
    <PostCard
      key={post.id}
      slug={post.slug}
      title={post.title}
      excerpt={post.excerpt || ""}
      featuredImage={post.featured_image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop"}
      author={{
        name: post.authors?.name || "BeamX Team",
        avatar: post.authors?.avatar_url || undefined,
      }}
      publishedAt={post.published_at || post.created_at}
      readTime={post.read_time || 5}
      tags={post.tags || []}
      featured={featured}
    />
  );

  const renderMockPost = (post: MockPost, featured = false) => (
    <PostCard
      key={post.id}
      slug={post.slug}
      title={post.title}
      excerpt={post.excerpt}
      featuredImage={post.featuredImage}
      author={post.author}
      publishedAt={post.publishedAt}
      readTime={post.readTime}
      tags={post.tags}
      featured={featured}
    />
  );

  const publishedMockPosts = mockPosts.filter((p) => p.isPublished);

  return (
    <Layout>
      <HeroSection />

      <section className="container py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : hasDbPosts ? (
          <>
            {/* Featured Post */}
            {dbPosts[0] && (
              <div className="mb-12">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Featured Article
                </h2>
                {renderDbPost(dbPosts[0], true)}
              </div>
            )}

            {/* Recent Posts */}
            {dbPosts.length > 1 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Latest Articles
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dbPosts.slice(1).map((post) => renderDbPost(post))}
                </div>
              </div>
            )}
          </>
        ) : publishedMockPosts.length > 0 ? (
          <>
            {/* Featured Post */}
            {publishedMockPosts[0] && (
              <div className="mb-12">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Featured Article
                </h2>
                {renderMockPost(publishedMockPosts[0], true)}
              </div>
            )}

            {/* Recent Posts */}
            {publishedMockPosts.length > 1 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Latest Articles
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedMockPosts.slice(1).map((post) => renderMockPost(post))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No published posts yet.</p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Index;
