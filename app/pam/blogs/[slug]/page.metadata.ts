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

    const blog = await response.json();
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

export default generateMetadata;
