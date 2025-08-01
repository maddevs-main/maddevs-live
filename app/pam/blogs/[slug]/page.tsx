import { notFound } from 'next/navigation';
import BlogClient from './BlogClient';

// Blog type (should match backend)
type Blog = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  content: string;
  imageUrl: string;
  detailImageUrl2: string;
  isPinned: boolean;
  tags: string[];
};

// Generate static params for all blog slugs
export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:4000/api/blogs', {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return [];
    }

    const blogs = await response.json();
    return blogs.map((blog: Blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    return [];
  }
}

// Generate metadata for each blog
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const response = await fetch(`http://localhost:4000/api/blogs/slug/${params.slug}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return {
        title: 'Blog Not Found',
        description: 'The requested blog article could not be found.',
      };
    }

    const blog: Blog = await response.json();
    const description = blog.excerpt || blog.content.substring(0, 160).replace(/\n/g, ' ');

    return {
      title: blog.title,
      description: description,
      openGraph: {
        title: blog.title,
        description: description,
        type: 'article',
        images: [
          {
            url: blog.imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        publishedTime: blog.date,
        authors: [blog.author],
        tags: blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: description,
        images: [blog.imageUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Article',
      description: 'Blog article from maddevs',
    };
  }
}

// Main page component
export default async function BlogSlugPage({ params }: { params: { slug: string } }) {
  try {
    const response = await fetch(`http://localhost:4000/api/blogs/slug/${params.slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      notFound();
    }

    const blog: Blog = await response.json();

    // Generate structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.excerpt || blog.content.substring(0, 160),
      author: {
        '@type': 'Person',
        name: blog.author,
      },
      datePublished: blog.date,
      image: blog.imageUrl,
      publisher: {
        '@type': 'Organization',
        name: 'maddevs',
        url: 'https://www.maddevs.in',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://yourdomain.com/pam/blogs/${blog.slug}`,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <BlogClient blog={blog} />
      </>
    );
  } catch (error) {
    notFound();
  }
}
