'use client';

import { useState, useEffect } from 'react';
import { 
  getOptimalImageWidth, 
  normalizeImageSource, 
  getOptimizedSanityImageUrl,
  ipfsToHttpUrl,
  getBlurPlaceholder
} from '@/utils/imageOptimization';

interface UseImageOptimizationProps {
  src: any; // Can be Sanity image reference, IPFS URI, or URL
  containerWidth?: number;
  quality?: number;
}

interface UseImageOptimizationResult {
  optimizedSrc: string;
  blurDataURL: string;
  isLoading: boolean;
  error: Error | null;
  aspectRatio: number | null;
}

/**
 * Hook for optimizing images from different sources
 */
export default function useImageOptimization({
  src,
  containerWidth = 800,
  quality = 85
}: UseImageOptimizationProps): UseImageOptimizationResult {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [blurDataURL, setBlurDataURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    const optimizeImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!src) {
          throw new Error('No image source provided');
        }

        // Get device pixel ratio
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        
        // Calculate optimal width
        const optimalWidth = getOptimalImageWidth(containerWidth, dpr);
        
        // Normalize image source
        const normalizedSrc = normalizeImageSource(src);
        
        let finalSrc = '';
        let blurSrc = '';

        if (normalizedSrc.type === 'sanity') {
          // Handle Sanity image
          finalSrc = getOptimizedSanityImageUrl(normalizedSrc.value, optimalWidth, quality);
          blurSrc = getBlurPlaceholder(normalizedSrc.value);
          
          // Try to get aspect ratio from Sanity image
          if (normalizedSrc.value?.asset?.metadata?.dimensions) {
            const { width, height } = normalizedSrc.value.asset.metadata.dimensions;
            if (width && height) {
              setAspectRatio(width / height);
            }
          }
        } else if (normalizedSrc.type === 'ipfs') {
          // Handle IPFS image
          finalSrc = ipfsToHttpUrl(normalizedSrc.value);
          // Use default blur for IPFS
          blurSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDIwIi8+PC9zdmc+';
        } else {
          // Handle regular URL
          finalSrc = normalizedSrc.value;
          // Use default blur for URLs
          blurSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDIwIi8+PC9zdmc+';
        }

        setOptimizedSrc(finalSrc);
        setBlurDataURL(blurSrc);
        setIsLoading(false);
      } catch (err) {
        console.error('Error optimizing image:', err);
        setError(err instanceof Error ? err : new Error('Unknown error optimizing image'));
        setIsLoading(false);
      }
    };

    optimizeImage();
  }, [src, containerWidth, quality]);

  return {
    optimizedSrc,
    blurDataURL,
    isLoading,
    error,
    aspectRatio
  };
}