// HTTP Basic auth for the validator endpoints. v0 = single shared password.

import type { VercelRequest, VercelResponse } from '@vercel/node';

const REALM = 'SASP Validator';

export function requireValidator(req: VercelRequest, res: VercelResponse): boolean {
  const expected = process.env.VALIDATOR_PASSWORD;
  if (!expected) {
    res.status(500).json({ error: 'VALIDATOR_PASSWORD not configured on server' });
    return false;
  }
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', `Basic realm="${REALM}"`);
    res.status(401).json({ error: 'Auth required' });
    return false;
  }
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf-8');
    const colonIdx = decoded.indexOf(':');
    if (colonIdx < 0) throw new Error('malformed');
    const password = decoded.slice(colonIdx + 1);
    if (password !== expected) {
      res.setHeader('WWW-Authenticate', `Basic realm="${REALM}"`);
      res.status(401).json({ error: 'Bad credentials' });
      return false;
    }
    return true;
  } catch {
    res.setHeader('WWW-Authenticate', `Basic realm="${REALM}"`);
    res.status(401).json({ error: 'Malformed credentials' });
    return false;
  }
}
