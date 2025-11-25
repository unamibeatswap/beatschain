// import { urlForImage } from '@/lib/sanity' // Temporarily disabled

const urlForImage = (source: any) => source?.url || source;

/**
 * Utility functions for image optimization
 */

/**
 * Determines the optimal image size based on viewport and container
 * @param containerWidth - Width of the container in pixels
 * @param devicePixelRatio - Device pixel ratio (defaults to 1)
 * @returns Optimal image width
 */
export function getOptimalImageWidth(containerWidth: number, devicePixelRatio: number = 1): number {
  // Calculate optimal width based on container and device pixel ratio
  // Round up to nearest 100 for better CDN caching
  return Math.ceil((containerWidth * devicePixelRatio) / 100) * 100;
}

/**
 * Generates responsive image sizes attribute for different viewports
 * @param defaultSize - Default size as percentage of viewport width
 * @param breakpoints - Custom breakpoints and sizes
 * @returns Sizes attribute string for the image
 */
export function generateSizes(
  defaultSize: string = '100vw',
  breakpoints?: { [key: string]: string }
): string {
  if (!breakpoints || Object.keys(breakpoints).length === 0) {
    return defaultSize;
  }

  // Convert breakpoints object to sizes string
  const sizesArray = Object.entries(breakpoints).map(
    ([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`
  );

  // Add default size at the end
  sizesArray.push(defaultSize);

  return sizesArray.join(', ');
}

/**
 * Optimizes a Sanity image URL with proper parameters
 * @param image - Sanity image reference
 * @param width - Desired width
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export function getOptimizedSanityImageUrl(
  image: any,
  width?: number,
  quality: number = 85
): string {
  if (!image) return '';

  let imageBuilder = urlForImage(image).auto('format').quality(quality);

  if (width) {
    imageBuilder = imageBuilder.width(width);
  }

  return imageBuilder.url();
}

/**
 * Generates a low-quality image placeholder for blur-up effect
 * @param image - Sanity image reference
 * @returns Blur placeholder URL
 */
export function getBlurPlaceholder(image: any): string {
  if (!image) {
    // Return a default SVG placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDIwIi8+PC9zdmc+';
  }

  return urlForImage(image)
    .width(20)
    .blur(10)
    .quality(20)
    .url();
}

/**
 * Normalizes different image source types to a standard format
 * @param src - Image source (can be Sanity reference, IPFS URI, or URL)
 * @returns Normalized image source object
 */
export function normalizeImageSource(src: any): {
  type: 'sanity' | 'ipfs' | 'url';
  value: string;
} {
  if (!src) {
    return { type: 'url', value: '' };
  }

  // Check if it's a Sanity image reference
  if (src._type === 'image' || src.asset) {
    return { type: 'sanity', value: src };
  }

  // Check if it's an IPFS URI
  if (typeof src === 'string' && (src.startsWith('ipfs://') || src.includes('/ipfs/'))) {
    return { type: 'ipfs', value: src };
  }

  // Default to regular URL
  return { type: 'url', value: typeof src === 'string' ? src : '' };
}

/**
 * Converts an IPFS URI to an HTTP URL using a gateway
 * @param ipfsUri - IPFS URI (ipfs://...)
 * @param gateway - IPFS gateway URL (defaults to ipfs.io)
 * @returns HTTP URL for the IPFS content
 */
export function ipfsToHttpUrl(
  ipfsUri: string,
  gateway: string = 'https://ipfs.io/ipfs/'
): string {
  if (!ipfsUri) return '';

  // Handle ipfs:// protocol
  if (ipfsUri.startsWith('ipfs://')) {
    const ipfsHash = ipfsUri.replace('ipfs://', '');
    return `${gateway}${ipfsHash}`;
  }

  // Handle /ipfs/ path
  if (ipfsUri.includes('/ipfs/')) {
    const ipfsHash = ipfsUri.split('/ipfs/')[1];
    return `${gateway}${ipfsHash}`;
  }

  // Return as is if not an IPFS URI
  return ipfsUri;
}