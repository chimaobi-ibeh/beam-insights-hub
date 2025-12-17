import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/blog/HeroSection";
import PostCard from "@/components/blog/PostCard";
import { posts } from "@/data/mockPosts";

const Index = () => {
  const publishedPosts = posts.filter((post) => post.isPublished);
  const featuredPost = publishedPosts[0];
  const recentPosts = publishedPosts.slice(1);

  return (
    <Layout>
      <HeroSection />
      
      <section className="container py-12">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">Featured Article</h2>
            <PostCard
              slug={featuredPost.slug}
              title={featuredPost.title}
              excerpt={featuredPost.excerpt}
              featuredImage={featuredPost.featuredImage}
              author={featuredPost.author}
              publishedAt={featuredPost.publishedAt}
              readTime={featuredPost.readTime}
              tags={featuredPost.tags}
              featured
            />
          </div>
        )}

        {/* Recent Posts */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">Latest Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
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
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
