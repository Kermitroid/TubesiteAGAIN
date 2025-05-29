import { auth } from './src/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  PATH_ADMIN,
  PATH_ADMIN_PHOTOS,
  PATH_OG,
  PATH_OG_SAMPLE,
  PREFIX_PHOTO,
  PREFIX_TAG
} from './src/app/paths';

export default function middleware(req: NextRequest, res: NextResponse) {
  const pathname = req.nextUrl.pathname;

  // First, handle URL redirects and rewrites
  // These transform the incoming request URL before authentication is applied

  // Redirect admin root to admin photos page
  // This provides a default landing page for admin users
  if (pathname === PATH_ADMIN) {
    return NextResponse.redirect(new URL(PATH_ADMIN_PHOTOS, req.url));
  }

  // Redirect Open Graph root to sample page
  // This ensures OG meta tags are properly displayed for social sharing
  if (pathname === PATH_OG) {
    return NextResponse.redirect(new URL(PATH_OG_SAMPLE, req.url));
  }

  // Handle user-friendly photo URLs
  // Converts /photos/123 to /p/123 internally while keeping the clean URL visible
  if (/^\/photos\/(.)+$/.test(pathname)) {
    const matches = pathname.match(/^\/photos\/(.+)$/);
    return NextResponse.rewrite(new URL(`${PREFIX_PHOTO}/${matches?.[1]}`, req.url));
  }

  // Handle user-friendly tag URLs
  // Converts /t/tagname to /tag/tagname internally for cleaner URLs
  if (/^\/t\/(.)+$/.test(pathname)) {
    const matches = pathname.match(/^\/t\/(.+)$/);
    return NextResponse.rewrite(new URL(`${PREFIX_TAG}/${matches?.[1]}`, req.url));
  }

  // After URL transformations, apply authentication middleware
  // This ensures auth rules apply to the final destination routes
  return auth(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
}

export const config = {
  // Comprehensive matcher that excludes routes that don't need middleware processing
  // This pattern balances performance (by skipping unnecessary processing)
  // with functionality (by catching all routes that need auth or URL transformation)

  // Excluded routes:
  // - /api and /api/auth* - API routes handle their own logic
  // - /_next/static* - Static assets don't need processing
  // - /_next/image* - Next.js image optimization routes
  // - /favicon.ico and /favicons/* - Browser icon requests
  // - /grid, /feed - Specific public routes that bypass middleware
  // - / (root) - Homepage typically doesn't need middleware
  // - /home-image, /template-* - Template and image generation routes

  matcher: [
    '/((?!api$|api/auth|_next/static|_next/image|favicon.ico$|favicons/|grid$|feed$|home-image$|template-image$|template-image-tight$|template-url$|$).*)'
  ]
};
