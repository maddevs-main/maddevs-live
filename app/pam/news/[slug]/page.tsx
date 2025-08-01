import { notFound } from 'next/navigation';
import NewsClient from './NewsClient';

// News type (should match backend)
type News = {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  imageUrl: string;
  content: string;
  layout: string;
  tags: string[];
};

// Generate static params for all news slugs
export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:4000/api/news', {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return [];
    }

    const news = await response.json();
    return news.map((article: News) => ({
      slug: article.slug,
    }));
  } catch (error) {
    return [];
  }
}

// Generate metadata for each news article
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const response = await fetch(`http://localhost:4000/api/news/slug/${params.slug}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return {
        title: 'News Article Not Found',
        description: 'The requested news article could not be found.',
      };
    }

    const article: News = await response.json();
    const description = article.subtitle || article.content.substring(0, 160).replace(/\n/g, ' ');

    return {
      title: article.title,
      description: description,
      openGraph: {
        title: article.title,
        description: description,
        type: 'article',
        images: article.imageUrl ? [
          {
            url: article.imageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: description,
        images: article.imageUrl ? [article.imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'News Article',
      description: 'News article from maddevs',
    };
  }
}

// Main page component
export default async function NewsSlugPage({ params }: { params: { slug: string } }) {
  try {
    const response = await fetch(`http://localhost:4000/api/news/slug/${params.slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      notFound();
    }

    const article: News = await response.json();

    // Validate required fields - removed imageUrl requirement
    if (!article.title || !article.content) {
      notFound();
    }

    // Generate structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.subtitle || article.content.substring(0, 160),
      image: article.imageUrl || undefined,
      publisher: {
        '@type': 'Organization',
        name: 'maddevs',
        url: 'https://www.maddevs.in',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://yourdomain.com/pam/news/${article.slug}`,
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
        <NewsClient article={article} />
      </>
    );
  } catch (error) {
    notFound();
  }
}
