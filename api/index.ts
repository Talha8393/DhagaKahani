import type { IncomingMessage, ServerResponse } from 'node:http';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let expressApp: import('express').Application | undefined;

function getApp() {
  if (!expressApp) {
    ({ app: expressApp } = require('./_app.cjs'));
  }
  return expressApp;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const app = getApp();

  return new Promise<void>((resolve, reject) => {
    const done = () => resolve();
    res.once('finish', done);
    res.once('close', done);
    res.once('error', reject);

    try {
      app(req as IncomingMessage, res as ServerResponse);
    } catch (error) {
      reject(error);
    }
  });
}

export const config = {
  maxDuration: 60,
};
