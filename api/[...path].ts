import serverless from 'serverless-http';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../server/dist/app.js';

const serverlessHandler = serverless(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return await serverlessHandler(req, res);
  } catch (error) {
    console.error('API handler error:', error);
    res.status(500).json({
      message: 'Internal server error',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

export const config = {
  maxDuration: 30,
};
