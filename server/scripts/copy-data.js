import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src/data');
const dest = path.join(__dirname, '../dist/data');

fs.cpSync(src, dest, { recursive: true });
console.log('Copied seed data to dist/data');
