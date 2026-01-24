// Protected routes that require authentication
const PROTECTED_ROUTES = ['/umra', '/notes', '/diary'];

// Secret key for token verification (must match API routes)
// TODO: Phase 2 - Use environment variable
const TOKEN_SECRET = 'phase1-secret-key-change-in-production';

interface TokenPayload {
  route: string;
  expiresAt: number;
  checksum: string;
}

function verifySessionToken(token: string): TokenPayload | null {
  try {
    // Decode base64 token
    const payload: TokenPayload = JSON.parse(atob(token));
    
    // Verify checksum to prevent tampering
    const checksumInput = `${payload.route}${payload.expiresAt}${TOKEN_SECRET}`;
    const expectedChecksum = btoa(checksumInput).slice(0, 8);
    
    if (payload.checksum !== expectedChecksum) {
      return null; // Token tampered with
    }
    
    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return null; // Token expired
    }
    
    return payload;
  } catch (error) {
    return null; // Invalid token format
  }
}

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // Check if the route is protected
  const isProtected = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));

  if (isProtected) {
    // Get session token from cookie
    const cookies = request.headers.get('cookie') || '';
    const sessionCookie = cookies
      .split(';')
      .find(c => c.trim().startsWith('auth_session='));

    if (!sessionCookie) {
      // No session token, redirect to password gate
      const redirectUrl = new URL('/private', request.url);
      return Response.redirect(redirectUrl, 302);
    }

    // Extract token value
    const token = sessionCookie.split('=')[1]?.trim();
    
    if (!token) {
      const redirectUrl = new URL('/private', request.url);
      return Response.redirect(redirectUrl, 302);
    }

    // Verify token
    const payload = verifySessionToken(token);
    
    if (!payload) {
      // Invalid or expired token, redirect to password gate
      const redirectUrl = new URL('/private', request.url);
      return Response.redirect(redirectUrl, 302);
    }

    // Verify that the token's route matches the requested route
    if (payload.route !== pathname && !pathname.startsWith(payload.route + '/')) {
      // Token is for a different route, redirect to password gate
      const redirectUrl = new URL('/private', request.url);
      return Response.redirect(redirectUrl, 302);
    }

    // Token is valid and matches the route - allow request to proceed
  }

  // Allow request to proceed
  return new Response(null, {
    status: 200,
  });
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    '/umra/:path*',
    '/notes/:path*',
    '/diary/:path*',
  ],
  runtime: 'edge',
};
