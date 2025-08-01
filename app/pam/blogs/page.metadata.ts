export const generateMetadata = async () => ({
  title: 'blogs/maddevs – creative web design and development',
  description:
    'Explore the maddevs blog—a curated stream of ideas on web design, user experience, digital branding, and creative development. From UI principles and responsive layouts to immersive interactions and design strategy, we share insights that shape meaningful websites and applications. Made for designers, founders, and teams building the next wave of digital expression.',
  openGraph: {
    title: 'blogs/maddevs – creative web design and development',
    description:
      'Dive into stories and insights from maddevs on designing and developing modern digital experiences. Topics span visual identity, web usability, branding, landing page architecture, creative workflows, and everything in between. A go-to space for those crafting thoughtful web presence.',
    url: 'https://maddevs.in/pam/blogs',
    siteName: 'maddevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/blogs.jpg',
        width: 1200,
        height: 630,
        alt: 'maddevs blogs – creative web design, modern development, and product insights',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'blogs/maddevs – creative web design and development',
    description:
      'maddevs blogs cover web design, development, UI/UX, and digital expression. Get inspired by real-world insights on building powerful, elegant websites and user-first digital products.',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/blogs.jpg'],
  },
});

export default generateMetadata;