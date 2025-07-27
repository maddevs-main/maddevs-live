"use client"
import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const LoadingHeading = styled.h1`
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: white;
  font-size: 5rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: lowercase;
  margin: 0;
`;

const MdText = styled.div`
  font-size: 15rem;
  font-weight: 900;
  font-family: 'Inter', sans-serif;
  position: relative;
  color: #333;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
`;

const MdFill = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #00ff88;
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
  clip-path: polygon(0 0, ${props => props.progress}% 0, ${props => props.progress}% 100%, 0 100%);
  transition: clip-path 0.3s ease-out;
`;

const ProgressText = styled.div`
  position: absolute;
  bottom: 2rem;
  color: white;
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.1em;
`;

interface LoadingProps {
  progress?: number;
}

export const generateMetadata = async () => ({
  title: 'LOADING PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'LOADING PAGE DESCRIPTION HERE', // TODO: Fill in unique description
});

export default function Loading({ progress = 0 }: LoadingProps) {
  return (
    <>
      <head>
        {/* Social Media Meta Tags */}
        <title>LOADING PAGE TITLE HERE</title>
        <meta name="description" content="LOADING PAGE DESCRIPTION HERE" />
        {/* Open Graph */}
        <meta property="og:title" content="LOADING PAGE TITLE HERE" />
        <meta property="og:description" content="LOADING PAGE DESCRIPTION HERE" />
        <meta property="og:url" content="https://maddevs.in/loading" />
        <meta property="og:site_name" content="MadDevs" />
        <meta property="og:image" content="https://maddevs.in/assets/media/heroBG.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Loading, web development, UI/UX, creative design" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LOADING PAGE TITLE HERE" />
        <meta name="twitter:description" content="LOADING PAGE DESCRIPTION HERE" />
        <meta name="twitter:site" content="@maddevs_in" />
        <meta name="twitter:creator" content="@maddevs_in" />
        <meta name="twitter:image" content="https://maddevs.in/assets/media/heroBG.jpg" />
      </head>
      <LoadingContainer>
      {/* SEO: Main headline for the page */}
      <LoadingHeading as="h1">LOADING PAGE TITLE HERE</LoadingHeading> {/* TODO: Match this to the title above */}
      {/* SEO: Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage', // TODO: Use a more specific type if possible
            'name': 'LOADING PAGE TITLE HERE', // TODO: Match this to the title above
            // ...add more fields as needed
          }),
        }}
      />
      <MdText>
        md.
        <MdFill progress={progress}>
          md. 
        </MdFill>
      </MdText>
      
      <ProgressText>
        {Math.round(progress)}%
      </ProgressText>
    </LoadingContainer>
    </>
  );
}
