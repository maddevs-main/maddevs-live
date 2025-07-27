export const generateMetadata = async () => ({
  title: 'ONBOARD PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'ONBOARD PAGE DESCRIPTION HERE', // TODO: Fill in unique description
  openGraph: {
    title: 'ONBOARD PAGE TITLE HERE',
    description: 'ONBOARD PAGE DESCRIPTION HERE',
    url: 'https://maddevs.in/onboard',
    siteName: 'MadDevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/door.jpg', // TODO: Use a relevant image for this page
        width: 1200,
        height: 630,
        alt: 'Onboarding, web development, creative design',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ONBOARD PAGE TITLE HERE',
    description: 'ONBOARD PAGE DESCRIPTION HERE',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/door.jpg'],
  },
});
 
export default generateMetadata; 