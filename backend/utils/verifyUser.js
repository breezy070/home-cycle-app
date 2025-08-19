import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.access_token;

//     if (!token) return next(errorHandler(401, "You are not authenticated"));

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return next(errorHandler(403, "Invalid Token"));
//         console.log('Verified User:', user);
//         req.user = user;
//         next();
//     })

// }

// backend/utils/verifyUser.js

// export const verifyToken = (req, res, next) => {
//   let token = req.cookies?.access_token;

//   // Fallback to Authorization: Bearer <token>
//   if (!token && req.headers.authorization?.startsWith('Bearer ')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) return next(errorHandler(401, 'You are not authenticated'));

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = payload; // { id, role, iat, exp }
//     return next();
//   } catch (err) {
//     return next(errorHandler(403, 'Invalid Token'));
//   }
// };

// utils/verifyUser.js
export const verifyToken = (req, res, next) => {
  if (process.env.AUTH_BYPASS === '1') { // ← TEST FLAG
    req.user = { id: 'test-user', role: 'user' };
    return next();
  }

  let token = req.cookies?.access_token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(errorHandler(401, 'You are not authenticated'));

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (_) {
    next(errorHandler(403, 'Invalid Token'));
  }
};



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

