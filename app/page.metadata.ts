export const generateMetadata = async () => ({
  title: 'PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'PAGE DESCRIPTION HERE', // TODO: Fill in unique description
  openGraph: {
    title: 'PAGE TITLE HERE',
    description: 'PAGE DESCRIPTION HERE',
    url: 'https://maddevs.in/', // TODO: Update if this is not the homepage
    siteName: 'MadDevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/heroBG.jpg', // TODO: Use a relevant image for this page
        width: 1200,
        height: 630,
        alt: 'Web development, UI/UX, and creative design',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAGE TITLE HERE',
    description: 'PAGE DESCRIPTION HERE',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/heroBG.jpg'],
  },
});
 
export default generateMetadata; 