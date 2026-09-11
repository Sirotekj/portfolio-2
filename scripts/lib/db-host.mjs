export function getDatabaseHost(connectionString) {
  if (!connectionString) {
    return '(missing DATABASE_URL)';
  }

  try {
    return new URL(connectionString.replace(/^postgresql:/, 'http:')).hostname;
  } catch {
    return '(invalid DATABASE_URL)';
  }
}
