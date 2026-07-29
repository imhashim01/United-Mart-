import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

import authRoutes from './src/modules/auth/routes/authRoutes.js';
import userRoutes from './src/modules/users/routes/userRoutes.js';
import adminRoutes from './src/modules/admin/routes/adminRoutes.js';
import categoryRoutes from './src/modules/categories/routes/categoryRoutes.js';
import brandRoutes from './src/modules/brands/routes/brandRoutes.js';
import productRoutes from './src/modules/products/routes/productRoutes.js';
import cartRoutes from './src/modules/cart/routes/cartRoutes.js';
import orderRoutes from './src/modules/orders/routes/orderRoutes.js';
import couponRoutes from './src/modules/coupons/routes/couponRoutes.js';
import rewardRoutes from './src/modules/rewards/routes/rewardRoutes.js';
import paymentRoutes from './src/modules/payments/routes/paymentRoutes.js';
import invoiceRoutes from './src/modules/invoices/routes/invoiceRoutes.js';
import reviewRoutes from './src/modules/reviews/routes/reviewRoutes.js';
import notificationRoutes from './src/modules/notifications/routes/notificationRoutes.js';
import reportRoutes from './src/modules/reports/routes/reportRoutes.js';

import { errorHandler, notFound } from './src/middlewares/errorHandler.js';

dotenv.config();

const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(compression());
  if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(mongoSanitize());

  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 200),
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/users`, userRoutes);
  app.use(`${API_PREFIX}/admins`, adminRoutes);
  app.use(`${API_PREFIX}/categories`, categoryRoutes);
  app.use(`${API_PREFIX}/brands`, brandRoutes);
  app.use(`${API_PREFIX}/products`, productRoutes);
  app.use(`${API_PREFIX}/cart`, cartRoutes);
  app.use(`${API_PREFIX}/orders`, orderRoutes);
  app.use(`${API_PREFIX}/coupons`, couponRoutes);
  app.use(`${API_PREFIX}/rewards`, rewardRoutes);
  app.use(`${API_PREFIX}/payments`, paymentRoutes);
  app.use(`${API_PREFIX}/invoices`, invoiceRoutes);
  app.use(`${API_PREFIX}/reviews`, reviewRoutes);
  app.use(`${API_PREFIX}/notifications`, notificationRoutes);
  app.use(`${API_PREFIX}/reports`, reportRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

const app = createApp();

export default app;
