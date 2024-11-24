import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

const app = express();

//allowing sending request json to the backend
app.use(express.json());

app.listen(3000, ()=> {
    console.log('Server listening on port 3000');
})

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes)

//error handling with middleware and function
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})