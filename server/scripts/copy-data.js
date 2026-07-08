import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src/data');
const targets = [
  path.join(__dirname, '../dist/data'),
  path.join(__dirname, '../../api/data'),
];

for (const dest of targets) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied seed data to ${dest}`);
}
