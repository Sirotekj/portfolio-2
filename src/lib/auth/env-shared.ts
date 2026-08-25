function decodeBase64Env(name: string): string | null {
  const encoded = process.env[name]?.trim();

  if (!encoded) {
    return null;
  }

  return Buffer.from(encoded, 'base64').toString('utf8');
}

export function getAdminSessionSecretValue(): string | null {
  return (
    decodeBase64Env('ADMIN_SESSION_SECRET_B64') ??
    process.env.ADMIN_SESSION_SECRET?.trim() ??
    null
  );
}

export function getAdminEmailValue(): string | null {
  return process.env.ADMIN_EMAIL?.trim() ?? null;
}
