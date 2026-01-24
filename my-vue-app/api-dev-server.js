// Local development server for API routes
// This allows testing API routes locally before deploying to Vercel
// Run with: node api-dev-server.js (in a separate terminal)

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Password to route mappings (same as verify-password.ts)
const PASSWORD_ROUTES = {
  'owali.umra': '/umra',
};

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'phase1-secret-key-change-in-production';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

function generateSessionToken(route) {
  const expiresAt = Date.now() + SESSION_DURATION;
  const payload = {
    route,
    expiresAt,
    checksum: Buffer.from(`${route}${expiresAt}${TOKEN_SECRET}`).toString('base64').slice(0, 8),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifySessionToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const expectedChecksum = Buffer.from(`${payload.route}${payload.expiresAt}${TOKEN_SECRET}`)
      .toString('base64')
      .slice(0, 8);
    
    if (payload.checksum !== expectedChecksum) {
      return null;
    }
    
    if (Date.now() > payload.expiresAt) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

// Verify password endpoint
app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  const targetRoute = PASSWORD_ROUTES[password];

  if (!targetRoute) {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid password. Please try again.' 
    });
  }

  const sessionToken = generateSessionToken(targetRoute);

  res.cookie('auth_session', sessionToken, {
    httpOnly: true,
    secure: false, // false for local dev
    sameSite: 'strict',
    maxAge: SESSION_DURATION,
    path: '/',
  });

  res.status(200).json({ 
    success: true,
    redirectTo: targetRoute 
  });
});

// Check auth endpoint
app.get('/api/check-auth', (req, res) => {
  const sessionToken = req.cookies?.auth_session;

  if (!sessionToken) {
    return res.status(401).json({ authorized: false });
  }

  const payload = verifySessionToken(sessionToken);

  if (!payload) {
    return res.status(401).json({ authorized: false });
  }

  res.status(200).json({ 
    authorized: true,
    route: payload.route 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to update Vite config to proxy /api requests to this server`);
});
