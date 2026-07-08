import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

export function adminOnly(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError(403, 'Admin access required'));
  }
  next();
}
