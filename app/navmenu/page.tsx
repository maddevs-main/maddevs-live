"use client"

import React from 'react';
import NavBar from '../../components/NavBar';


export const generateMetadata = async () => ({
  title: 'NAV MENU PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'NAV MENU PAGE DESCRIPTION HERE', // TODO: Fill in unique description
});

export default function Ace() {
  return (
    <>
      <head>
        {/* Social Media Meta Tags */}
        <title>NAV MENU PAGE TITLE HERE</title>
        <meta name="description" content="NAV MENU PAGE DESCRIPTION HERE" />
        {/* Open Graph */}
        <meta property="og:title" content="NAV MENU PAGE TITLE HERE" />
        <meta property="og:description" content="NAV MENU PAGE DESCRIPTION HERE" />
        <meta property="og:url" content="https://maddevs.in/navmenu" />
        <meta property="og:site_name" content="MadDevs" />
        <meta property="og:image" content="https://maddevs.in/assets/media/heroBG.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Navigation, web development, UI/UX, creative design" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NAV MENU PAGE TITLE HERE" />
        <meta name="twitter:description" content="NAV MENU PAGE DESCRIPTION HERE" />
        <meta name="twitter:site" content="@maddevs_in" />
        <meta name="twitter:creator" content="@maddevs_in" />
        <meta name="twitter:image" content="https://maddevs.in/assets/media/heroBG.jpg" />
      </head>
      <div className="w-full h-screen">
      {/* SEO: Main headline for the page */}
      <h1>NAV MENU PAGE TITLE HERE</h1> {/* TODO: Match this to the title above */}
      {/* SEO: Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage', // TODO: Use a more specific type if possible
            'name': 'NAV MENU PAGE TITLE HERE', // TODO: Match this to the title above
            // ...add more fields as needed
          }),
        }}
      />
      {/* ...rest of your page... */}
    </div>
    </>
  );
}
