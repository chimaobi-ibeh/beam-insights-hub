import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { usePost, usePublishedPosts } from "@/hooks/usePosts";
import { posts as mockPosts } from "@/data/mockPosts";
import PostCard from "@/components/blog/PostCard";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePost(slug || "");
  const { data: allPosts } = usePublishedPosts();

  // Fallback to mock data if no database post found
  const mockPost = mockPosts.find((p) => p.slug === slug);
  const displayPost = post || mockPost;
  const useMock = !post && !!mockPost;

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!displayPost) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Normalize post data
  const postData = useMock
    ? {
        title: mockPost!.title,
        excerpt: mockPost!.excerpt,
        body: mockPost!.body,
        featuredImage: mockPost!.featuredImage,
        author: mockPost!.author,
        tags: mockPost!.tags,
        publishedAt: mockPost!.publishedAt,
        readTime: mockPost!.readTime,
      }
    : {
        title: post!.title,
        excerpt: post!.excerpt || "",
        body: post!.body || "",
        featuredImage: post!.featured_image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
        author: {
          name: post!.authors?.name || "BeamX Team",
          avatar: post!.authors?.avatar_url || undefined,
          bio: post!.authors?.bio || "",
        },
        tags: post!.tags || [],
        publishedAt: post!.published_at || post!.created_at,
        readTime: post!.read_time || 5,
      };

  const relatedMockPosts = useMock
    ? mockPosts.filter((p) => p.id !== mockPost!.id && p.isPublished).slice(0, 2)
    : [];

  const relatedDbPosts = !useMock
    ? (allPosts || []).filter((p) => p.id !== post!.id).slice(0, 2)
    : [];

  const formattedDate = new Date(postData.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-hero-animated py-12 md:py-16">
        <div className="container">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>
          <div className="max-w-3xl">
            <div className="flex gap-2 mb-4">
              {postData.tags.map((tag) => (
                <Badge key={tag} className="bg-accent/20 text-accent border-0">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {postData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src={postData.author.avatar} alt={postData.author.name} />
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {postData.author.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium text-white">{postData.author.name}</p>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {postData.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <img
              src={postData.featuredImage}
              alt={postData.title}
              className="w-full aspect-video object-cover rounded-lg mb-8"
            />
            <div 
              className="blog-content prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: postData.body }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Author Card */}
            <div className="bg-card rounded-lg p-6 shadow-card mb-8">
              <h3 className="font-display font-semibold mb-4">About the Author</h3>
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={postData.author.avatar} alt={postData.author.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {postData.author.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{postData.author.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {postData.author.bio || "Expert at BeamX Solutions"}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary rounded-lg p-6 text-primary-foreground mb-8">
              <h3 className="font-display font-semibold mb-2">Need Expert Help?</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Let BeamX Solutions help you unlock the value in your data.
              </p>
              <Button
                asChild
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <a
                  href="https://calendly.com/beamxsolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Free Consultation
                </a>
              </Button>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {(useMock ? relatedMockPosts : relatedDbPosts).length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-xl font-semibold mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {useMock
                ? relatedMockPosts.map((relatedPost) => (
                    <PostCard
                      key={relatedPost.id}
                      slug={relatedPost.slug}
                      title={relatedPost.title}
                      excerpt={relatedPost.excerpt}
                      featuredImage={relatedPost.featuredImage}
                      author={relatedPost.author}
                      publishedAt={relatedPost.publishedAt}
                      readTime={relatedPost.readTime}
                      tags={relatedPost.tags}
                    />
                  ))
                : relatedDbPosts.map((relatedPost) => (
                    <PostCard
                      key={relatedPost.id}
                      slug={relatedPost.slug}
                      title={relatedPost.title}
                      excerpt={relatedPost.excerpt || ""}
                      featuredImage={
                        relatedPost.featured_image ||
                        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop"
                      }
                      author={{
                        name: relatedPost.authors?.name || "BeamX Team",
                        avatar: relatedPost.authors?.avatar_url || undefined,
                      }}
                      publishedAt={relatedPost.published_at || relatedPost.created_at}
                      readTime={relatedPost.read_time || 5}
                      tags={relatedPost.tags || []}
                    />
                  ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default PostPage;
