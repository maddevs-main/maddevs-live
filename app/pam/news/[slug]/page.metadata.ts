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

    const article = await response.json();
    const description = article.subtitle || article.content.substring(0, 160).replace(/\n/g, ' ');

    return {
      title: article.title,
      description: description,
      openGraph: {
        title: article.title,
        description: description,
        type: 'article',
        images: [
          {
            url: article.imageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: description,
        images: [article.imageUrl],
      },
    };
  } catch (error) {

    return {
      title: 'News Article',
      description: 'News article from maddevs',
    };
  }
}

export default generateMetadata;
