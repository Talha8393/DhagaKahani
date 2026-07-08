import serverless from 'serverless-http';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let handler: ReturnType<typeof serverless> | undefined;

export default async function vercelHandler(req: VercelRequest, res: VercelResponse) {
  if (!handler) {
    const { app } = await import('../server/dist/app.js');
    handler = serverless(app);
  }
  return handler(req, res);
}
