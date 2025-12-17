import Layout from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { authors, posts } from "@/data/mockPosts";

const AboutPage = () => {
  const getAuthorPostCount = (authorId: string) => {
    return posts.filter((post) => post.author.id === authorId && post.isPublished).length;
  };

  return (
    <Layout>
      <div className="bg-hero py-16">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            About Our <span className="text-accent">Blog</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Expert insights on data analytics, AI, and business intelligence from the BeamX Solutions team.
          </p>
        </div>
      </div>

      <section className="container py-12">
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            At BeamX Solutions, we believe there's gold in your data. Our blog is dedicated to sharing 
            practical insights, industry trends, and expert knowledge to help businesses unlock the 
            full potential of their data.
          </p>
          <p className="text-muted-foreground">
            Whether you're just starting your data journey or looking to optimize your existing 
            analytics infrastructure, our team of experts shares actionable advice and real-world 
            case studies to guide your success.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold mb-6">Meet Our Authors</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {authors.map((author) => (
              <Card key={author.id} className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={author.avatar} alt={author.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {author.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-display font-semibold text-lg">{author.name}</h3>
                      <p className="text-sm text-accent mb-2">{getAuthorPostCount(author.id)} articles</p>
                      <p className="text-sm text-muted-foreground">{author.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
