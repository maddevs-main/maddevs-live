'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Script from 'next/script';
import HomeEnd from '@/components/segments/HomeSectionEnd';
import HorizontalHome from '@/components/segments/HomeHorizontalScrollFourth';
import HomeFirst from '@/components/segments/HomeBrowserFirst';
import TextScroll from '@/components/segments/HomeScrollTextSecond';
import SlideshowComponent from '@/components/segments/HomeImagesSliderThird';
import LenisSmoothScroll from '@/components/LenisSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const textRefs = useRef<HTMLDivElement[]>([]);

  // SEO Structured Data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'maddevs',
    url: 'https://maddevs.in',
    logo: 'https://maddevs.in/assets/media/logo.png',
    description:
      'Creative web design & development studio crafting expressive websites, robust platforms, and intelligent systems. We merge architectural clarity with intentional design, building digital experiences that endure.',
    sameAs: [
      'https://twitter.com/maddevsgroup',
      'https://www.linkedin.com/company/maddevs',
      'https://github.com/maddevs'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@maddevs.in',
      availableLanguage: 'English'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN'
    },
    founder: {
      '@type': 'Person',
      name: 'maddevs'
    },
    foundingDate: '2020',
    numberOfEmployees: '10-50'
  };
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'Organisation',
    name: 'maddevs',
    url: 'https://maddevs.in',
    description:
      'Creative web design & development studio building expressive, high-performance digital systems. From elegant landing pages to complex platforms, we shape web experiences that blend beauty with intelligence.',
    publisher: {
      '@type': 'Organization',
      name: 'maddevs',
      url: 'https://maddevs.in'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://maddevs.in/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
  useEffect(() => {
    // Page load tracking
    const startTime = performance.now();
    console.log(
      "Welcome to maddevs, this page was designed and created by maddevs, visit 'https://www.maddevs.in' for further information"
    );

    sectionRefs.current.forEach((section, idx) => {
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        scrub: 1,
        snap: {
          snapTo: 1,
          duration: 0.4,
          ease: 'power2.inOut',
        },
      });

      const text = textRefs.current[idx];
      if (text) {
        gsap.fromTo(
          text,
          { autoAlpha: 0, y: 50 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top center',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => {
      const endTime = performance.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`The page loaded in ${loadTime} seconds`);
    };
  }, []);

  return (
    <>
      {/* SEO Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />

      <LenisSmoothScroll />
      <HomeFirst />

      <TextScroll />
      <SlideshowComponent />

      <HorizontalHome />
      <HomeEnd />
    </>
  );
};

export default Home;
