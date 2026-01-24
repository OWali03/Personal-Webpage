import type { VercelRequest, VercelResponse } from '@vercel/node';

// Secret key for token verification (must match verify-password.ts)
// TODO: Phase 2 - Use proper JWT with a secure secret from environment variables
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'phase1-secret-key-change-in-production';

interface TokenPayload {
  route: string;
  expiresAt: number;
  checksum: string;
}

function verifySessionToken(token: string): TokenPayload | null {
  try {
    const payload: TokenPayload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Verify checksum to prevent tampering
    const expectedChecksum = Buffer.from(`${payload.route}${payload.expiresAt}${TOKEN_SECRET}`)
      .toString('base64')
      .slice(0, 8);
    
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get session token from cookie
  const sessionToken = req.cookies?.auth_session;

  if (!sessionToken) {
    return res.status(401).json({ authorized: false });
  }

  // Verify and decode token
  const payload = verifySessionToken(sessionToken);

  if (!payload) {
    return res.status(401).json({ authorized: false });
  }

  // Session is valid
  res.status(200).json({ 
    authorized: true,
    route: payload.route 
  });
}
