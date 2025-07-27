import React, { useRef, useEffect, useState } from 'react';

interface VideoAutoPlayProps {
  src: string;
  poster?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  top?: string | number;
  left?: string | number;
}

const VideoAutoPlay: React.FC<VideoAutoPlayProps> = ({ src, poster, className, width, height, top, left }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { threshold: 0.25 }
      );
      observer.observe(video);
    } else {
      // Fallback: always play
      setIsInView(true);
    }
    return () => {
      if (observer && video) observer.unobserve(video);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  // Compute style
  const style: React.CSSProperties = {
    width: width !== undefined ? width : '100%',
    height: height !== undefined ? height : 'auto',
    display: 'block',
    position: (top !== undefined || left !== undefined) ? 'absolute' : undefined,
    top: top !== undefined ? top : undefined,
    left: left !== undefined ? left : undefined,
  };

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      style={style}
      tabIndex={-1}
      controls={false}
    />
  );
};

export default VideoAutoPlay; 