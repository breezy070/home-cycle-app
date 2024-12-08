import express from 'express';
import { test, updateUser, deleteUser, scheduleAppointment } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

router.post('/schedule-appointment', scheduleAppointment)

export default router;