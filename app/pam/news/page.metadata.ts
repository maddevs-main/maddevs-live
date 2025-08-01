export const generateMetadata = async () => ({
  title: 'news/maddevs – creative web design and development',
  description:
    'Stay updated with maddevs — announcements, new launches, collaborations, and stories behind the websites, platforms, and experiences we build. From design thinking and UI/UX to performance strategy and modern site development, this is where we share our journey in shaping expressive digital products.',
  openGraph: {
    title: 'news/maddevs – creative web design and development',
    description:
      'Discover what’s new at maddevs — creative milestones, client collaborations, and insights into the process of crafting impactful websites, digital platforms, and branded experiences. Follow our work in design, development, and digital storytelling.',
    url: 'https://maddevs.in/pam/news',
    siteName: 'maddevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/news.jpg',
        width: 1200,
        height: 630,
        alt: 'maddevs news – web design updates and digital product releases',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'news/maddevs – creative web design and development',
    description:
      'News from maddevs: website launches, product design updates, and the creative thinking behind our digital work. Explore our recent stories in web development, branding, and experience design.',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/news.jpg'],
  },
});

export default generateMetadata;