import { jwtVerify } from 'jose';

import { ADMIN_SESSION_COOKIE } from './constants';
import { getAdminEmailValue, getAdminSessionSecretValue } from './env-shared';

export { ADMIN_SESSION_COOKIE };

export async function verifyAdminSessionTokenEdge(
  token: string,
): Promise<boolean> {
  const secret = getAdminSessionSecretValue();
  const email = getAdminEmailValue();

  if (!secret || !email) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    const subject = payload.sub ?? payload.email;
    return subject === email;
  } catch {
    return false;
  }
}
