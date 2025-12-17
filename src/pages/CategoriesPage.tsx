import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories, posts } from "@/data/mockPosts";
import { ArrowRight } from "lucide-react";

const CategoriesPage = () => {
  const getPostsByTag = (tagName: string) => {
    return posts.filter((post) => 
      post.isPublished && post.tags.some((tag) => tag.toLowerCase().includes(tagName.toLowerCase()))
    );
  };

  return (
    <Layout>
      <div className="bg-hero py-16">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Browse by <span className="text-accent">Category</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Explore our articles organized by topic to find exactly what you're looking for.
          </p>
        </div>
      </div>

      <section className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryPosts = getPostsByTag(category.name);
            return (
              <Card key={category.slug} className="shadow-card border-0 hover:shadow-lg transition-shadow group">
                <CardContent className="p-6">
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20 mb-4">
                    {categoryPosts.length} articles
                  </Badge>
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                  <ul className="space-y-2 mb-4">
                    {categoryPosts.slice(0, 2).map((post) => (
                      <li key={post.id}>
                        <Link 
                          to={`/post/${post.slug}`}
                          className="text-sm text-muted-foreground hover:text-accent transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to={`/category/${category.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default CategoriesPage;
