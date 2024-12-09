import express from 'express';
import { verifyToken, verifyRole } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/');
router.get('/technicians', verifyToken, verifyRole('admin'), getAllTechnicians);


export default router;