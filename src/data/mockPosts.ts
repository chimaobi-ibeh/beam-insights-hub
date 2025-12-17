export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  slug: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  author: Author;
  tags: string[];
  publishedAt: string;
  readTime: number;
  isPublished: boolean;
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Sarah Chen",
    bio: "Head of Data Strategy at BeamX Solutions. 10+ years in business intelligence and analytics.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    slug: "sarah-chen",
  },
  {
    id: "2",
    name: "Michael Torres",
    bio: "Senior AI Engineer specializing in machine learning and predictive analytics.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    slug: "michael-torres",
  },
];

export const posts: Post[] = [
  {
    id: "1",
    slug: "unlocking-business-value-with-data-analytics",
    title: "Unlocking Business Value with Data Analytics: A Complete Guide",
    excerpt: "Discover how modern data analytics can transform raw data into actionable insights that drive business growth and competitive advantage.",
    body: `
## Introduction

In today's data-driven world, organizations that effectively leverage their data gain significant competitive advantages. At BeamX Solutions, we've helped dozens of companies transform their raw data into actionable insights.

## The Power of Data Analytics

Data analytics isn't just about collecting numbers—it's about understanding patterns, predicting trends, and making informed decisions. Here's how businesses can unlock value:

### 1. Descriptive Analytics
Understanding what happened in your business through historical data analysis.

### 2. Predictive Analytics
Using machine learning and statistical models to forecast future outcomes.

### 3. Prescriptive Analytics
Recommending specific actions based on data insights.

## Key Benefits

- **Improved Decision Making**: Data-driven decisions reduce risk and increase success rates
- **Operational Efficiency**: Identify bottlenecks and optimize processes
- **Customer Insights**: Understand customer behavior and preferences
- **Revenue Growth**: Identify new opportunities and optimize pricing

## Getting Started

The journey to data-driven decision making starts with understanding your current data landscape. BeamX Solutions can help you assess your data maturity and develop a roadmap for success.

## Conclusion

Data analytics is no longer optional—it's essential for business survival and growth. Start your journey today.
    `,
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    author: authors[0],
    tags: ["Data Analytics", "Business Intelligence"],
    publishedAt: "2024-12-15",
    readTime: 8,
    isPublished: true,
  },
  {
    id: "2",
    slug: "ai-transforming-business-operations",
    title: "How AI is Transforming Business Operations in 2024",
    excerpt: "Explore the latest AI trends and how they're revolutionizing business processes across industries.",
    body: `
## The AI Revolution

Artificial Intelligence has moved from buzzword to business essential. In 2024, we're seeing unprecedented adoption across all industries.

## Key AI Applications

### Process Automation
AI-powered automation is handling repetitive tasks, freeing employees for strategic work.

### Customer Service
Intelligent chatbots and virtual assistants provide 24/7 support with human-like interactions.

### Predictive Maintenance
Manufacturing and logistics companies use AI to predict equipment failures before they occur.

## Implementation Strategies

1. **Start Small**: Begin with pilot projects to prove value
2. **Focus on Data Quality**: AI is only as good as its training data
3. **Build Internal Capabilities**: Invest in your team's AI literacy
4. **Partner Wisely**: Work with experienced AI implementation partners

## The Future

AI will continue to evolve, but the fundamentals remain the same: quality data, clear objectives, and thoughtful implementation.
    `,
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    author: authors[1],
    tags: ["Artificial Intelligence", "Automation"],
    publishedAt: "2024-12-10",
    readTime: 6,
    isPublished: true,
  },
  {
    id: "3",
    slug: "building-data-driven-culture",
    title: "Building a Data-Driven Culture in Your Organization",
    excerpt: "Learn the essential steps to foster a culture where data informs every decision across your organization.",
    body: `
## Why Culture Matters

Technology alone won't make your organization data-driven. You need a culture that values data-informed decision making at every level.

## Key Elements

### Leadership Buy-In
Executives must model data-driven behavior and invest in analytics capabilities.

### Data Literacy
Every employee should understand basic data concepts and how to interpret reports.

### Accessible Tools
Make data and analytics tools available to those who need them.

## Common Challenges

- Resistance to change
- Data silos
- Lack of skills
- Poor data quality

## Building Blocks for Success

1. **Define Clear Metrics**: What does success look like?
2. **Democratize Data**: Make data accessible to all
3. **Celebrate Wins**: Share success stories of data-driven decisions
4. **Continuous Learning**: Invest in ongoing training

## Conclusion

Building a data-driven culture is a journey, not a destination. Start today.
    `,
    featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    author: authors[0],
    tags: ["Data Culture", "Leadership"],
    publishedAt: "2024-12-05",
    readTime: 5,
    isPublished: true,
  },
  {
    id: "4",
    slug: "power-bi-vs-tableau-2024",
    title: "Power BI vs Tableau: Which BI Tool is Right for You in 2024?",
    excerpt: "A comprehensive comparison of the two leading business intelligence platforms to help you make the right choice.",
    body: `
## Overview

Choosing the right BI tool is crucial for your analytics success. Let's compare the two market leaders.

## Power BI Strengths

- **Microsoft Integration**: Seamless with Excel, Azure, and Microsoft 365
- **Cost-Effective**: Lower licensing costs for most organizations
- **AI Features**: Built-in AI capabilities for natural language queries

## Tableau Strengths

- **Visualization**: Superior data visualization capabilities
- **Flexibility**: More options for advanced visualizations
- **Community**: Large, active user community

## Key Considerations

### Budget
Power BI generally offers better value for smaller teams.

### Existing Stack
Microsoft shops benefit from Power BI integration.

### Use Case
Complex visualizations favor Tableau; quick dashboards favor Power BI.

## Our Recommendation

There's no one-size-fits-all answer. Contact BeamX Solutions for a personalized assessment.
    `,
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    author: authors[1],
    tags: ["Business Intelligence", "Tools"],
    publishedAt: "2024-11-28",
    readTime: 7,
    isPublished: true,
  },
];

export const categories = [
  { name: "Data Analytics", slug: "data-analytics", count: 12 },
  { name: "Artificial Intelligence", slug: "artificial-intelligence", count: 8 },
  { name: "Business Intelligence", slug: "business-intelligence", count: 10 },
  { name: "Data Culture", slug: "data-culture", count: 5 },
  { name: "Tools & Platforms", slug: "tools-platforms", count: 6 },
];
