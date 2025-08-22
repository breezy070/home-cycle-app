// import express from 'express';
// import cors from 'cors'
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import userRoutes from './routes/userRoute.js';
// import technicianRoutes from './routes/technicianRoute.js'
// import adminRoutes from './routes/adminRoute.js'
// import authRoutes from './routes/authRoute.js';
// import interventionRoutes from './routes/interventionRoute.js'
// import factureRoutes from './routes/factureRoute.js'
// import cookieParser from 'cookie-parser';
// import logRequestMiddleware from './utils/logRequestMiddleware.js';
// import healthRoutes from "./routes/healthRoute.js";


// dotenv.config();

// mongoose.connect(process.env.MONGO_URI).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.log(err);
// });

// const app = express();

// app.set('trust proxy', 1);

// //CORSS
// app.use(cors({
//   origin: ['https://homecyclehome.netlify.app', 'http://localhost:5173'],
//   credentials: true
// }));

// // app.use(cors({
// //   origin: true,
// //   credentials: true
// // }));


// // // FOR TESTING
// // // Permissive CORS for testing
// //   app.use(cors({ origin: true, credentials: true }));
// //   app.options('*', cors());
// // // Also handle preflight explicitly (optional but nice)
// // app.options('*', cors());
// // //FOR TESTING


// //allowing sending request json to the backend
// app.use(express.json());

// app.use(cookieParser());

// // app.listen(3000, ()=> {
// //     console.log('Server listening on port 3000');
// // })
// // const PORT = process.env.PORT || 3000;



// app.use(logRequestMiddleware);


// app.use("/health", healthRoutes);



// app.use("/api/user", userRoutes);
// app.use("/api/technician", technicianRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/auth", authRoutes)
// app.use("/api/interventions", interventionRoutes)
// app.use("/api/factures", factureRoutes)

// if (process.env.NODE_ENV !== 'test') {
//   const port = process.env.PORT || 3000
//   app.listen(port, () => console.log(`API listening on :${port}`))
// }

// // app.listen(PORT, () => {
// //   console.log(`Server listening on port ${PORT}`);
// // });

// //error handling with middleware and function
// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     const message = err.message || 'Internal Server Error'
//     return res.status(statusCode).json({
//         success: false,
//         message,
//         statusCode
//     })
// })

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

// 👇 Export the app for Supertest
export default app;
