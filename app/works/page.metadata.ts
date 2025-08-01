export const generateMetadata = async () => ({
  title: 'works/maddevs - creative web design & development',
  description:
    'A curated showcase of our collaborative web design and development work. At maddevs, we craft expressive digital experiences—custom websites, intuitive interfaces, and intelligent systems—designed to feel as good as they function. Explore how we shape vision into reality through purposeful design and empathetic engineering.',
  openGraph: {
    title: 'works/maddevs - creative web design & development',
    description:
      'Browse the digital portfolio of maddevs—where creativity meets precision. We design and build custom websites, immersive experiences, and intelligent web platforms that express your brand with clarity and impact.',
    url: 'https://maddevs.in/works',
    siteName: 'maddevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/web_design_two.png',
        width: 1200,
        height: 630,
        alt: 'maddevs digital portfolio – creative studio web design and development',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'works/maddevs - creative web design & development',
    description:
      'Explore our digital portfolio—a selection of intentional, human-centered websites and platforms by maddevs. We build expressive web experiences that connect, convert, and evolve.',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/web_design_two.png'],
  },
});

export default generateMetadata;