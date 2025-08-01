import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourdomain.com'; // Replace with your actual domain

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/works`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pam/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pam/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/onboard`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  try {
    // Fetch all blogs
    const blogsResponse = await fetch('http://localhost:4000/api/blogs', {
      next: { revalidate: 3600 },
    });
    const blogs = blogsResponse.ok ? await blogsResponse.json() : [];

    // Fetch all news
    const newsResponse = await fetch('http://localhost:4000/api/news', {
      next: { revalidate: 3600 },
    });
    const news = newsResponse.ok ? await newsResponse.json() : [];

    // Blog pages
    const blogPages = blogs.map((blog: any) => ({
      url: `${baseUrl}/pam/blogs/${blog.slug}`,
      lastModified: new Date(blog.date || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // News pages
    const newsPages = news.map((article: any) => ({
      url: `${baseUrl}/pam/news/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...blogPages, ...newsPages];
  } catch (error) {

    return staticPages;
  }
}
