export const generateMetadata = async () => ({
  title: 'products/maddevs - creative web design & development',
  description:
    'Explore the digital products and modular systems crafted by maddevs—fully integrated web applications, e-commerce platforms, landing pages, RBAC user systems, authentication workflows, and embedded payment modules. We build scalable, design-forward tools engineered for flexibility, performance, and future-ready integrations.',
  openGraph: {
    title: 'products/maddevs - creative web design & development',
    description:
      'Discover maddevs’ suite of custom-built web products—from standalone applications and e-commerce frameworks to user authentication modules, payment systems, and role-based access controls. Designed with purpose. Built for performance.',
    url: 'https://maddevs.in/products',
    siteName: 'maddevs',
    images: [
      {
        url: 'https://maddevs.in/assets/media/web_design_two.jpg', // Changed from .mp4 to .png for metadata compliance
        width: 1200,
        height: 630,
        alt: 'maddevs web products – authentication, e-commerce, dashboards, integrations',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'products/maddevs - creative web design & development',
    description:
      'maddevs builds modular digital products—web apps, e-commerce systems, landing pages, blog platforms, auth systems, and custom dashboards—all designed for seamless integration and user-first experience.',
    site: '@maddevs_in',
    creator: '@maddevs_in',
    images: ['https://maddevs.in/assets/media/web_development_design_products.png'],
  },
});

export default generateMetadata;