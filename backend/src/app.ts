import express, {
  type ErrorRequestHandler,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

import { pool } from './config/db';
import { requireAuth } from './middleware/requireAuth';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import mosquesRouter from './routes/mosques';
import usersRouter from './routes/users';
import weeklyCollectionsRouter from './routes/weeklyCollections';
import fundRequestsRouter from './routes/fundRequests';
import paymentAccountsRouter from './routes/paymentAccounts';
import type AppError from './middleware/AppError';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRouter);
app.use('/api/auth', authRouter);

app.use('/api/mosques', requireAuth, mosquesRouter);
app.use('/api/users', requireAuth, usersRouter);
app.use('/api/weekly-collections', requireAuth, weeklyCollectionsRouter);
app.use('/api/fund-requests', requireAuth, fundRequestsRouter);
app.use('/api/payment-accounts', requireAuth, paymentAccountsRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = (err as AppError).status || 500;
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(status).json({
    error: message || 'Internal server error',
  });
};

app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to PostgreSQL');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('PostgreSQL connection failed:', message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();

export default app;
