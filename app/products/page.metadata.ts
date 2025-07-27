export const generateMetadata = async () => ({
  title: 'PRODUCTS PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'PRODUCTS PAGE DESCRIPTION HERE', // TODO: Fill in unique description
  openGraph: {
    title: 'PRODUCTS PAGE TITLE HERE',
    description: 'PRODUCTS PAGE DESCRIPTION HERE',
    url: 'https://maddevs.in/products',
    siteName: 'MadDevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/products.mp4', // TODO: Use a relevant image for this page
        width: 1200,
        height: 630,
        alt: 'Products, SaaS, AI-powered solutions, digital products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRODUCTS PAGE TITLE HERE',
    description: 'PRODUCTS PAGE DESCRIPTION HERE',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/products.mp4'],
  },
});
 
export default generateMetadata; 