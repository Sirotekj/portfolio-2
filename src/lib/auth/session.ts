import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import { findUserByEmail } from '@/lib/auth/users';

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from './constants';
import { getAdminSessionSecret, hasSessionSecretConfig } from './config';

type AdminSessionPayload = {
  email: string;
};

function isValidSessionEmail(email: unknown): email is string {
  return typeof email === 'string' && email.includes('@');
}

export async function createAdminSession(email: string): Promise<void> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAdminSessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function verifyAdminSessionToken(
  token: string,
): Promise<AdminSessionPayload | null> {
  if (!hasSessionSecretConfig()) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getAdminSessionSecret());
    const email = payload.sub ?? payload.email;

    if (!isValidSessionEmail(email)) {
      return null;
    }

    return { email };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await verifyAdminSessionToken(token);

  if (!session) {
    return null;
  }

  const user = await findUserByEmail(session.email);

  if (!user) {
    return null;
  }

  return session;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}
