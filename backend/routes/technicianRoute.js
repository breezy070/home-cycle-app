import express from 'express';
import { updateTechnician, deleteTechnician } from '../controllers/technicianController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/');
router.post('/update/technician/:id', verifyToken, updateTechnician);
router.delete('/delete/technician/:id', verifyToken, deleteTechnician);

export default router;