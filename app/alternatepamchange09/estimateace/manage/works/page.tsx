// page.tsx
'use client';
import TextScroll from '@/components/segments/HomeScrollTextSecond';
import HomeEnd from '@/components/segments/HomeSectionEnd';
import Footer from '@/components/Footer';
import HorizontalHome from '@/components/segments/HomeHorizontalScrollFourth';
import App from '@/components/segments/HomeBrowserFirst';
import ScrollSections from '@/components/segments/HomeHorizontalScrollFourth';
import AdvancedSlider from '@/components/segments/HomeImagesSliderThird';

export default function Page() {
  return (
    <div>
      <div>
        <App />

        <AdvancedSlider />
        <HorizontalHome />
        <HomeEnd />
      </div>
    </div>
  );
}
