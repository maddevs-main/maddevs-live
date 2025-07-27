export const generateMetadata = async () => ({
  title: 'ABOUT MAIN PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'ABOUT MAIN PAGE DESCRIPTION HERE', // TODO: Fill in unique description
  openGraph: {
    title: 'ABOUT MAIN PAGE TITLE HERE',
    description: 'ABOUT MAIN PAGE DESCRIPTION HERE',
    url: 'https://maddevs.in/about',
    siteName: 'MadDevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/design_1.png', // TODO: Use a relevant image for this page
        width: 1200,
        height: 630,
        alt: 'About MadDevs, digital agency, creative design',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABOUT MAIN PAGE TITLE HERE',
    description: 'ABOUT MAIN PAGE DESCRIPTION HERE',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/design_1.png'],
  },
});
 
export default generateMetadata; 