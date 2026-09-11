import { spawnSync } from 'child_process';

import { getDatabaseHost } from './lib/db-host.mjs';
import { loadProjectEnv, resolveEnvTarget } from './lib/load-env.mjs';

const target = resolveEnvTarget(process.argv[2]);
const { envFile } = loadProjectEnv(target);

console.log(`Prisma Studio → ${target} (${envFile})`);
console.log(`Database host: ${getDatabaseHost(process.env.DATABASE_URL)}\n`);

const result = spawnSync('npx', ['prisma', 'studio'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: target === 'prod' ? 'production' : 'development',
  },
});

process.exit(result.status ?? 1);
