import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCategoriesWithPostCount, usePublishedPosts } from "@/hooks/usePosts";
import { ArrowRight } from "lucide-react";

const CategoriesPage = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategoriesWithPostCount();
  const { data: posts, isLoading: postsLoading } = usePublishedPosts();

  const isLoading = categoriesLoading || postsLoading;

  const getPostsForCategory = (categoryId: string) => {
    return posts?.filter(post => post.categories?.id === categoryId) || [];
  };

  return (
    <Layout>
      <div className="bg-hero-animated py-16">
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
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryPosts = getPostsForCategory(category.id);
              return (
                <Card key={category.slug} className="shadow-card border-0 hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <Badge className="bg-accent/10 text-accent hover:bg-accent/20 mb-4">
                      {category.postCount} {category.postCount === 1 ? "article" : "articles"}
                    </Badge>
                    <h3 className="font-display text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
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
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories found.</p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CategoriesPage;
