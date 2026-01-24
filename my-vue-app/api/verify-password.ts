import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serialize } from 'cookie';

// Password to route mappings
// TODO: Phase 2 - Move to database (Supabase/Vercel KV) for easy management
const PASSWORD_ROUTES: Record<string, string> = {
  'owali.umra': '/umra',
  // Future mappings:
  // 'owali.notes': '/notes',
  // 'owali.diary': '/diary',
};

// Secret key for token encoding (in production, use environment variable)
// TODO: Phase 2 - Use proper JWT with a secure secret from environment variables
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'phase1-secret-key-change-in-production';

// Session expires after 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000;

// Generate a self-contained session token (route + expiration encoded)
// Phase 1: Simple encoding (not cryptographically secure, but sufficient for basic protection)
// Phase 2: Upgrade to proper JWT with signing
function generateSessionToken(route: string): string {
  const expiresAt = Date.now() + SESSION_DURATION;
  const payload = {
    route,
    expiresAt,
    // Add a simple checksum to prevent tampering
    checksum: Buffer.from(`${route}${expiresAt}${TOKEN_SECRET}`).toString('base64').slice(0, 8),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Check if password matches any route
  const targetRoute = PASSWORD_ROUTES[password];

  if (!targetRoute) {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid password. Please try again.' 
    });
  }

  // Generate self-contained session token
  const sessionToken = generateSessionToken(targetRoute);

  // Set httpOnly cookie for security
  const cookie = serialize('auth_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ 
    success: true,
    redirectTo: targetRoute 
  });
}
