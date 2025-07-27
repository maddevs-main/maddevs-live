export const generateMetadata = async () => ({
  title: 'SERVICES PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'SERVICES PAGE DESCRIPTION HERE', // TODO: Fill in unique description
  openGraph: {
    title: 'SERVICES PAGE TITLE HERE',
    description: 'SERVICES PAGE DESCRIPTION HERE',
    url: 'https://maddevs.in/services',
    siteName: 'MadDevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/services_hero.jpg', // TODO: Use a relevant image for this page
        width: 1200,
        height: 630,
        alt: 'Web development, design, creative digital experiences',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SERVICES PAGE TITLE HERE',
    description: 'SERVICES PAGE DESCRIPTION HERE',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/services_hero.jpg'],
  },
});
 
export default generateMetadata; 