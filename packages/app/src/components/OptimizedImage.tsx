'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
// import { urlForImage } from '@/lib/sanity' // Temporarily disabled

const urlForImage = (source: any) => source?.url || source;

type ImageSource = {
  type: 'sanity' | 'ipfs' | 'url';
  value: string;
  alt?: string;
  width?: number;
  height?: number;
};

interface OptimizedImageProps {
  src: ImageSource;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
}

/**
 * OptimizedImage component that handles different image sources (Sanity, IPFS, URL)
 * with blur-up loading effect and proper error handling
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  onLoad,
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [blurDataURL, setBlurDataURL] = useState<string>('');

  useEffect(() => {
    const getImageSrc = async () => {
      try {
        if (src.type === 'sanity' && src.value) {
          // Handle Sanity image
          const imageUrl = urlForImage(src.value)
            .auto('format')
            .quality(quality)
            .url();
          
          // Generate blur data URL for Sanity images
          const blurUrl = urlForImage(src.value)
            .width(20)
            .blur(10)
            .quality(20)
            .url();
          
          setImageSrc(imageUrl);
          setBlurDataURL(blurUrl);
        } else if (src.type === 'ipfs' && src.value) {
          // Handle IPFS image
          const ipfsGateway = 'https://ipfs.io/ipfs/';
          const ipfsHash = src.value.replace('ipfs://', '');
          setImageSrc(`${ipfsGateway}${ipfsHash}`);
          // No blur for IPFS images, use default
          setBlurDataURL('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDIwIi8+PC9zdmc+');
        } else if (src.type === 'url' && src.value) {
          // Handle regular URL
          setImageSrc(src.value);
          // No blur for regular URLs, use default
          setBlurDataURL('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDIwIi8+PC9zdmc+');
        } else {
          throw new Error('Invalid image source');
        }
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
      }
    };

    getImageSrc();
  }, [src, quality]);

  const handleImageLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  if (error || !imageSrc) {
    // Return fallback image or placeholder
    return (
      <div 
        className={`bg-gray-200 ${className}`} 
        style={{ 
          aspectRatio: src.width && src.height ? `${src.width}/${src.height}` : '16/9',
          width: fill ? '100%' : 'auto',
          height: fill ? '100%' : 'auto'
        }}
        aria-label={alt}
      >
        <div className="flex items-center justify-center h-full w-full text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ 
      width: fill ? '100%' : 'auto',
      height: fill ? '100%' : 'auto'
    }}>
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={!fill && src.width ? src.width : undefined}
        height={!fill && src.height ? src.height : undefined}
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoad}
        placeholder="blur"
        blurDataURL={blurDataURL}
      />
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}