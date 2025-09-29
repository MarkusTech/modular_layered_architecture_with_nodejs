import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}