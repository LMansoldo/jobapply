import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
}

interface LinkedInUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  picture?: string;
}

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';
const LINKEDIN_SCOPE = 'openid profile email';

async function exchangeCodeForToken(code: string, redirectUri: string): Promise<LinkedInTokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: process.env.LINKEDIN_CLIENT_ID as string,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET as string,
  });

  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const error: Error & { status?: number } = new Error('Failed to exchange LinkedIn code for token');
    error.status = 502;
    throw error;
  }

  return response.json() as Promise<LinkedInTokenResponse>;
}

async function fetchLinkedInProfile(accessToken: string): Promise<LinkedInUserInfo> {
  const response = await fetch(LINKEDIN_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error: Error & { status?: number } = new Error('Failed to fetch LinkedIn profile');
    error.status = 502;
    throw error;
  }

  return response.json() as Promise<LinkedInUserInfo>;
}

/**
 * GET /auth/linkedin?redirect_uri=...&state=...
 * Redirects to LinkedIn authorization page.
 */
export function linkedinRedirect(req: Request, res: Response): void {
  const { redirect_uri, state } = req.query as { redirect_uri?: string; state?: string };

  if (!redirect_uri) {
    res.status(400).json({ message: 'redirect_uri is required' });
    return;
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID as string,
    redirect_uri,
    scope: LINKEDIN_SCOPE,
    ...(state ? { state } : {}),
  });

  res.redirect(`${LINKEDIN_AUTH_URL}?${params.toString()}`);
}

/**
 * POST /auth/linkedin/callback
 * Body: { code, redirect_uri, state?, action?: 'login' | 'analyze' }
 * - action=analyze: returns { profile } without touching user records
 * - action=login (default): finds or creates user, returns { token, user }
 */
export async function linkedinCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      code,
      redirect_uri,
      action = 'login',
    } = req.body as {
      code?: string;
      state?: string;
      redirect_uri?: string;
      action?: 'login' | 'analyze';
    };

    if (!code || !redirect_uri) {
      res.status(400).json({ message: 'code and redirect_uri are required' });
      return;
    }

    const tokenData = await exchangeCodeForToken(code, redirect_uri);
    const profile = await fetchLinkedInProfile(tokenData.access_token);

    if (action === 'analyze') {
      res.json({ profile });
      return;
    }

    // Find by linkedinId → fallback to email → create new
    let user = await User.findOne({ linkedinId: profile.sub });

    if (!user) {
      user = await User.findOne({ email: profile.email });
      if (user) {
        user.linkedinId = profile.sub;
        await user.save();
      }
    }

    if (!user) {
      user = await new User({
        name: profile.name,
        email: profile.email,
        linkedinId: profile.sub,
      }).save();
    }

    const token = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, cv: user.cv ?? null },
    });
  } catch (err) {
    next(err);
  }
}
