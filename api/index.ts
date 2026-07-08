import serverless from 'serverless-http';
import { app } from './handler.mjs';

export default serverless(app);

export const config = {
  maxDuration: 30,
};
