export const generateMetadata = async () => ({
  title: 'about/maddevs - creative web design & development',
  description:
    'maddevs is a creative studio, tech consultancy, and software agency based in India and working globally. We craft immersive, high-end websites, web applications, tools, and digital expressions—merging technology with intentional design. From expressive landing pages and e-commerce to integrated RBAC systems and custom web tools, we build for impact and precision across the US, UK, UAE, Europe, Australia, and beyond.',
  openGraph: {
    title: 'about/maddevs - creative web design & development',
    description:
      'We are a global creative and technology consultancy crafting digital expressions—websites, apps, tools, and integrations—with empathy, clarity, and immersive design. Headquartered in India, serving clients worldwide.',
    url: 'https://maddevs.in/about',
    siteName: 'maddevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/web_design_one.png',
        width: 1200,
        height: 630,
        alt: 'About maddevs – global creative studio, web design & development team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'about/maddevs - creative web design & development',
    description:
      'maddevs is a global creative tech studio. We design and build expressive websites, apps, tools, and integrations with high-end aesthetics and robust systems for worldwide clients.',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/web_design_one.png'],
  },
});

export default generateMetadata;