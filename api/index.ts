import { createRequire } from 'node:module';
import serverless from 'serverless-http';

const require = createRequire(import.meta.url);
const { app } = require('./_app.cjs');

export default serverless(app);

export const config = {
  maxDuration: 30,
};
