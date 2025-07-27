export const generateMetadata = async () => ({
  title: 'WORKS PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'WORKS PAGE DESCRIPTION HERE', // TODO: Fill in unique description
  openGraph: {
    title: 'WORKS PAGE TITLE HERE',
    description: 'WORKS PAGE DESCRIPTION HERE',
    url: 'https://maddevs.in/works',
    siteName: 'MadDevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/design_2.png', // TODO: Use a relevant image for this page
        width: 1200,
        height: 630,
        alt: 'Portfolio, web development, UI/UX, creative projects',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WORKS PAGE TITLE HERE',
    description: 'WORKS PAGE DESCRIPTION HERE',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/design_2.png'],
  },
});
 
export default generateMetadata; 