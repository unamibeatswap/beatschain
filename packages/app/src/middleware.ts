import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Regex patterns for different asset types
const STATIC_ASSETS_PATTERN = /\.(jpg|jpeg|png|webp|avif|gif|ico|svg)$/;
const FONT_ASSETS_PATTERN = /\.(woff|woff2|ttf|otf|eot)$/;
const AUDIO_ASSETS_PATTERN = /\.(mp3|wav|ogg)$/;

/**
 * Middleware to add proper caching headers for static assets
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and non-static assets
  if (
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') ||
    pathname.includes('/studio/')
  ) {
    return NextResponse.next();
  }

  // Clone the response headers
  const response = NextResponse.next();
  
  // Add cache control headers based on asset type
  if (STATIC_ASSETS_PATTERN.test(pathname)) {
    // Images - cache for 1 week, revalidate after 1 day
    response.headers.set(
      'Cache-Control',
      'public, max-age=604800, stale-while-revalidate=86400'
    );
  } else if (FONT_ASSETS_PATTERN.test(pathname)) {
    // Fonts - cache for 1 year, immutable
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  } else if (AUDIO_ASSETS_PATTERN.test(pathname)) {
    // Audio files - cache for 1 day, revalidate after 1 hour
    response.headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=3600'
    );
  }

  return response;
}

// Configure the middleware to match specific paths
export const config = {
  matcher: [
    // Match all paths except API routes and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};