import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRoutes from './features/auth/routes/auth.routes';
import sessionRoutes from './features/session/routes/session.routes';
import userRoutes from './features/user/routes/user.routes';
import { APP_ORIGIN, NODE_ENV } from './lib/constants/env';
import authenticate from './middleware/authenticate';
import errorHandler from './middleware/errorHandler';
import { OK } from './lib/constants/http';
import rootRoutes from './root.routes';
import cowRoutes from './features/animals/cow/router/cow.router';
import { seedCowsDynamic } from './scripts/seedAdvancedCows';
import { Request, Response } from 'express';
import { deleteAllCows } from './scripts/deleteAllCows';

const app = express();

// Express middleware config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: APP_ORIGIN,
  })
);
app.use(cookieParser());

/**
 * ROUTES
 */

// Health check
app.get('/health', (req, res) => {
  res.status(OK).json({ status: 'healthy' });
  return;
});

app.post('/dev/seed-cows', async (req: Request, res: Response) => {
  if (NODE_ENV !== 'development') {
    res.status(403).json({ message: 'Forbidden outside development' });
    return;
  }
  try {
    await seedCowsDynamic();
    res.status(200).json({ message: 'Cows seeded successfully' });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error seeding cows', error: String(err) });
    return;
  }
});

app.delete('/dev/delete-cows', async (req: Request, res: Response) => {
  if (NODE_ENV !== 'development') {
    res.status(403).json({ message: 'Forbidden outside development' });
    return;
  }
  try {
    await deleteAllCows();
    res.status(200).json({ message: 'Cows deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting cows', error: String(err) });
    return;
  }
});

// Public routes
app.use('/auth', authRoutes);

// Protected routes (require authentication)
app.use('/user', authenticate, userRoutes);
app.use('/sessions', authenticate, sessionRoutes);

// Animal routes (protected)
app.use('/cows', authenticate, cowRoutes);
// TODO: implement
// app.use('/sheeps', authenticate, sheepRoutes);

// Root/index routes
app.use('/', rootRoutes);

// App Error Handler
app.use(errorHandler);

export default app;
