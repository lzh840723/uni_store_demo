import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { rootRouter } from './routes/index.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (_, callback) => callback(null, true),
      credentials: true
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.use(rootRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  });

  return app;
}
