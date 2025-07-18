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
import sheepRoutes from './features/animals/sheep/router/sheep.router';
import ownerRoutes from './features/animals/owner/router/owner.router';
import { seedCowsDynamic } from './scripts/seedAdvancedCows';
import { Request, Response } from 'express';
import { deleteAllCows } from './scripts/deleteAllCows';
import { seedSheepsDynamic } from './scripts/seedAdvancedSheeps';
import { deleteAllSheeps } from './scripts/deleteAllSheeps';
import devRoutes from './features/_dev/router/dev.router';

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

// Public routes
app.use('/auth', authRoutes);

// Protected routes (require authentication)
app.use('/user', authenticate, userRoutes);
app.use('/sessions', authenticate, sessionRoutes);

// Animal routes (protected)
app.use('/cows', authenticate, cowRoutes);
app.use('/sheeps', authenticate, sheepRoutes);

app.use('/owners', authenticate, ownerRoutes);

// DB Seeding / Deleting
app.use('/dev', devRoutes);

// Root/index routes
app.use('/', rootRoutes);

// App Error Handler
app.use(errorHandler);

export default app;
