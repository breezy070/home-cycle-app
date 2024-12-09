import express from 'express';
import { test, updateUser, deleteUser, scheduleAppointment, getAppointments, cancelAppointment } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

router.post('/schedule-appointment', verifyToken, scheduleAppointment)
router.get('/scheduled-appointments/:userId', verifyToken, getAppointments)
router.put('/scheduled-appointments/update/:appointmentId', verifyToken, cancelAppointment)

export default router;