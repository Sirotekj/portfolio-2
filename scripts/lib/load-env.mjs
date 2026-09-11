import { config } from 'dotenv';
import { resolve } from 'path';

export function resolveEnvTarget(value) {
  return value === 'prod' ? 'prod' : 'dev';
}

export function loadProjectEnv(target = 'dev') {
  const resolved = resolveEnvTarget(target);
  const envFile =
    resolved === 'prod' ? '.env.production.local' : '.env.development.local';

  config({ path: resolve(process.cwd(), envFile) });
  config({ path: resolve(process.cwd(), '.env') });

  return { envFile, target: resolved };
}
