import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { posts } from "@/data/mockPosts";
import PostCard from "@/components/blog/PostCard";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedPosts = posts
    .filter((p) => p.id !== post.id && p.isPublished)
    .slice(0, 2);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-hero py-12 md:py-16">
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
              {post.tags.map((tag) => (
                <Badge key={tag} className="bg-accent/20 text-accent border-0">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {post.author.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">{post.author.name}</p>
                </div>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
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
              src={post.featuredImage}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-lg mb-8"
            />
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent">
              {post.body.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('- ')) {
                  return <li key={index} className="ml-6 text-muted-foreground">{paragraph.replace('- ', '')}</li>;
                }
                if (paragraph.match(/^\d\. /)) {
                  return <li key={index} className="ml-6 text-muted-foreground list-decimal">{paragraph.replace(/^\d\. /, '')}</li>;
                }
                if (paragraph.trim()) {
                  return <p key={index} className="mb-4 text-muted-foreground leading-relaxed">{paragraph}</p>;
                }
                return null;
              })}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Author Card */}
            <div className="bg-card rounded-lg p-6 shadow-card mb-8">
              <h3 className="font-display font-semibold mb-4">About the Author</h3>
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {post.author.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{post.author.bio}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary rounded-lg p-6 text-primary-foreground mb-8">
              <h3 className="font-display font-semibold mb-2">Need Expert Help?</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Let BeamX Solutions help you unlock the value in your data.
              </p>
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <a href="https://calendly.com/beamxsolutions" target="_blank" rel="noopener noreferrer">
                  Book Free Consultation
                </a>
              </Button>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-xl font-semibold mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
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
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default PostPage;
