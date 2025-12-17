import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar } from "lucide-react";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: number;
  tags: string[];
  featured?: boolean;
}

const PostCard = ({
  slug,
  title,
  excerpt,
  featuredImage,
  author,
  publishedAt,
  readTime,
  tags,
  featured = false,
}: PostCardProps) => {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (featured) {
    return (
      <Card className="overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300 border-0">
        <Link to={`/post/${slug}`} className="block">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-video md:aspect-auto overflow-hidden">
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex gap-2 mb-4">
                {tags.slice(0, 2).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-accent/10 text-accent hover:bg-accent/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 line-clamp-2 hover:text-accent transition-colors">
                {title}
              </h2>
              <p className="text-muted-foreground mb-6 line-clamp-3">{excerpt}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {author.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{author.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readTime} min read
                  </span>
                </div>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 border-0 group">
      <Link to={`/post/${slug}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-5">
          <div className="flex gap-2 mb-3">
            {tags.slice(0, 2).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-accent/10 text-accent hover:bg-accent/20 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                  {author.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{author.name}</span>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {readTime} min
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PostCard;
