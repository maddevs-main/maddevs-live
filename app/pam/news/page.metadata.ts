export const generateMetadata = async () => ({
  title: 'NEWS PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'NEWS PAGE DESCRIPTION HERE', // TODO: Fill in unique description
  openGraph: {
    title: 'NEWS PAGE TITLE HERE',
    description: 'NEWS PAGE DESCRIPTION HERE',
    url: 'https://maddevs.in/pam/news',
    siteName: 'MadDevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/news.jpg', // TODO: Use a relevant image for this page
        width: 1200,
        height: 630,
        alt: 'News, web development, digital agency, technology updates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEWS PAGE TITLE HERE',
    description: 'NEWS PAGE DESCRIPTION HERE',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/news.jpg'],
  },
});

export default generateMetadata; 