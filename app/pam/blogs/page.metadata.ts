export const generateMetadata = async () => ({
  title: 'BLOGS PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'BLOGS PAGE DESCRIPTION HERE', // TODO: Fill in unique description
  openGraph: {
    title: 'BLOGS PAGE TITLE HERE',
    description: 'BLOGS PAGE DESCRIPTION HERE',
    url: 'https://maddevs.in/pam/blogs',
    siteName: 'MadDevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/blogs.jpg', // TODO: Use a relevant image for this page
        width: 1200,
        height: 630,
        alt: 'Blogs, web development, user experience, digital product insights',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLOGS PAGE TITLE HERE',
    description: 'BLOGS PAGE DESCRIPTION HERE',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/blogs.jpg'],
  },
});

export default generateMetadata; 