import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/blog/HeroSection";
import PostCard from "@/components/blog/PostCard";
import { usePublishedPosts, PostWithAuthor } from "@/hooks/usePosts";
import { posts as mockPosts, Post as MockPost } from "@/data/mockPosts";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  const { data: dbPosts, isLoading } = usePublishedPosts();
  const [searchQuery, setSearchQuery] = useState("");

  // Use database posts if available, otherwise fall back to mock data
  const hasDbPosts = dbPosts && dbPosts.length > 0;
  const publishedMockPosts = mockPosts.filter((p) => p.isPublished);

  // Fuse.js configuration for fuzzy search
  const fuseOptions = {
    keys: ["title", "excerpt", "tags", "body"],
    threshold: 0.3,
    ignoreLocation: true,
  };

  // Create fuse instances for both db and mock posts
  const dbFuse = useMemo(() => {
    if (!dbPosts) return null;
    return new Fuse(dbPosts, fuseOptions);
  }, [dbPosts]);

  const mockFuse = useMemo(() => {
    return new Fuse(publishedMockPosts, {
      keys: ["title", "excerpt", "tags", "content"],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [publishedMockPosts]);

  // Filter posts based on search query
  const filteredDbPosts = useMemo(() => {
    if (!dbPosts) return [];
    if (!searchQuery.trim()) return dbPosts;
    if (!dbFuse) return dbPosts;
    return dbFuse.search(searchQuery).map((result) => result.item);
  }, [dbPosts, searchQuery, dbFuse]);

  const filteredMockPosts = useMemo(() => {
    if (!searchQuery.trim()) return publishedMockPosts;
    return mockFuse.search(searchQuery).map((result) => result.item);
  }, [publishedMockPosts, searchQuery, mockFuse]);

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

  return (
    <Layout>
      <HeroSection />

      <section className="container py-12">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : hasDbPosts ? (
          <>
            {filteredDbPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found matching "{searchQuery}"</p>
              </div>
            ) : (
              <>
                {/* Featured Post - only show when not searching */}
                {!searchQuery.trim() && filteredDbPosts[0] && (
                  <div className="mb-12">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                      Featured Article
                    </h2>
                    {renderDbPost(filteredDbPosts[0], true)}
                  </div>
                )}

                {/* Posts Grid */}
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    {searchQuery.trim() ? `Search Results (${filteredDbPosts.length})` : "Latest Articles"}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(searchQuery.trim() ? filteredDbPosts : filteredDbPosts.slice(1)).map((post) => renderDbPost(post))}
                  </div>
                </div>
              </>
            )}
          </>
        ) : filteredMockPosts.length > 0 ? (
          <>
            {/* Featured Post - only show when not searching */}
            {!searchQuery.trim() && filteredMockPosts[0] && (
              <div className="mb-12">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Featured Article
                </h2>
                {renderMockPost(filteredMockPosts[0], true)}
              </div>
            )}

            {/* Posts Grid */}
            {(searchQuery.trim() ? filteredMockPosts : filteredMockPosts.slice(1)).length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  {searchQuery.trim() ? `Search Results (${filteredMockPosts.length})` : "Latest Articles"}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(searchQuery.trim() ? filteredMockPosts : filteredMockPosts.slice(1)).map((post) => renderMockPost(post))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery.trim() ? `No posts found matching "${searchQuery}"` : "No published posts yet."}
            </p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Index;
