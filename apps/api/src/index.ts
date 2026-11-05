import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import type { HealthResponse, ApiErrorResponse } from '@thikana/shared';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  requestId?: string;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request ID middleware
app.use((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const incomingId = req.headers['x-request-id'];
  const requestId = typeof incomingId === 'string' && incomingId.trim().length > 0
    ? incomingId
    : randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
});

// GET /v1/health
app.get('/v1/health', (_req: Request, res: Response<HealthResponse>) => {
  res.status(200).json({ status: 'ok' });
});

// 404 Handler for unknown routes adhering to Rule 6 error shape
app.use((req: AuthenticatedRequest, res: Response<ApiErrorResponse>) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
      request_id: req.requestId || randomUUID(),
    },
  });
});

// Centralized error handler adhering to Rule 6 error shape
app.use((err: Error, req: AuthenticatedRequest, res: Response<ApiErrorResponse>, _next: NextFunction) => {
  const requestId = req.requestId || randomUUID();
  console.error(`[Error] Request ID: ${requestId}`, err);

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      request_id: requestId,
    },
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Thikana API] Server listening on http://localhost:${PORT}`);
  });
}

export default app;
