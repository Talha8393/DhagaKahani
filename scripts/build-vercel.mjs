import { execSync } from 'node:child_process';
import { build } from 'esbuild';

console.log('Building client...');
execSync('npm run build --prefix client', { stdio: 'inherit' });

console.log('Building server...');
execSync('npm run build --prefix server', { stdio: 'inherit' });

console.log('Bundling API for Vercel...');
await build({
  entryPoints: ['server/src/app.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'api/handler.mjs',
  packages: 'external',
  logLevel: 'info',
});

console.log('Vercel build complete.');
