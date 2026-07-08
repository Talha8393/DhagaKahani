import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { build } from 'esbuild';

console.log('Building client...');
execSync('npm run build --prefix client', { stdio: 'inherit' });

console.log('Building server...');
execSync('npm run build --prefix server', { stdio: 'inherit' });

console.log('Bundling Express app...');
await build({
  entryPoints: ['server/src/app.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: 'api/_app.cjs',
  packages: 'external',
  logLevel: 'info',
});

// Small wrapper Vercel executes
fs.writeFileSync(
  'api/index.js',
  `const serverless = require('serverless-http');\nconst { app } = require('./_app.cjs');\nmodule.exports = serverless(app);\n`,
  'utf8',
);

for (const file of ['api/index.ts', 'api/index.cjs', 'api/index.mjs', 'api/handler.mjs', 'api/handler.cjs']) {
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

console.log('Vercel build complete.');
