import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, "You are not authenticated"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, "Invalid Token"));
        console.log('Verified User:', user);
        req.user = user;
        next();
    })

}

export const verifyRole = (...roles) => {
    return (req, res, next) => {
        console.log('User:', req.user);
        console.log('Allowed roles:', roles);
        if (!req.user || !roles.includes(req.user.role)) {
            return next(errorHandler(403, "Access denied. Insufficient permissions."));
        }
        next();
    };
};

