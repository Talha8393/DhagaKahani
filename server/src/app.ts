import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import usersRoutes from './routes/users.routes.js';
import adminRoutes from './routes/admin.routes.js';

export const app = express();

const allowedOrigins = new Set(
  [env.clientUrl, process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean) as string[],
);

if (process.env.VERCEL_URL) {
  allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin) || origin.endsWith('.vercel.app')) {
        callback(null, origin ?? env.clientUrl);
      } else {
        callback(null, env.clientUrl);
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// Vercel may strip /api prefix when routing to the serverless function
app.use((req, _res, next) => {
  if (env.isVercel && req.url && !req.url.startsWith('/api')) {
    const [pathname, query = ''] = req.url.split('?');
    req.url = `/api${pathname.startsWith('/') ? pathname : `/${pathname}`}${query ? `?${query}` : ''}`;
  }
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: env.isVercel ? 'vercel' : 'local' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);
