export async function generateMetadata({ params }: { params: { slug: string } }) {
  // TODO: Fetch news data by params.slug and return real title/description
  return {
    title: 'NEWS ARTICLE TITLE HERE', // TODO: Fill in unique title
    description: 'NEWS ARTICLE DESCRIPTION HERE', // TODO: Fill in unique description
  };
}

export default generateMetadata; 