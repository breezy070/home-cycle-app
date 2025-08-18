import express from 'express';
import { updateTechnician, deleteTechnician, getTechnicianAppointments } from '../controllers/technicianController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// router.get('/');
router.get('/scheduled-technician-appointments/:technicianId', verifyToken, getTechnicianAppointments)
router.post('/update/:id', verifyToken, updateTechnician);
router.delete('/delete/technician/:id', verifyToken, deleteTechnician);

export default router;