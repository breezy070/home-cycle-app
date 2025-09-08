import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import technicianRoutes from './routes/technicianRoute.js';
import adminRoutes from './routes/adminRoute.js';
import authRoutes from './routes/authRoute.js';
import interventionRoutes from './routes/interventionRoute.js';
import factureRoutes from './routes/factureRoute.js';
import cookieParser from 'cookie-parser';
import logRequestMiddleware from './utils/logRequestMiddleware.js';
import healthRoutes from './routes/healthRoute.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

// CORS
app.use(cors({
  origin: ['https://homecyclehome.netlify.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Request logging
app.use(logRequestMiddleware);

// // Helmet protection
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: true,
//       directives: {
//         "default-src": ["'self'"],
//         "script-src": ["'self'"],     
//         "style-src": ["'self'", "'unsafe-inline'"],
//         "img-src": ["'self'", "data:"],
//         "connect-src": ["'self'", "https://api.yourdomain.tld", "http://localhost:3000"],
//         "frame-ancestors": ["'self'"],
//         "upgrade-insecure-requests": [],
//       },
//     },
//     referrerPolicy: { policy: "no-referrer" },
//     crossOriginResourcePolicy: { policy: "same-site" },
//     crossOriginEmbedderPolicy: false,
//   })
// );

// // NoSQL injection & operator-pollution protection
// app.use(
//   mongoSanitize({
//     replaceWith: "_", // replaces $ and . to avoid NoSQL operator injection
//   })
// );

// // rate limiting for auth/sensitive routes
// const authLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 100,                 // adjust to traffic
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use("/api/auth", authLimiter);


// Routes

app.use('/health', healthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/factures', factureRoutes);

// Only connect & listen when NOT running tests
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      const port = process.env.PORT || 3000;
      app.listen(port, () => console.log(`API listening on :${port}`));
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});

export default app;
