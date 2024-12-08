import express from 'express';
import { getAllTechnicians, getTechnicianZone, assignTechnicianZone } from '../controllers/adminController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/');
router.get('/technicians', verifyToken, getAllTechnicians);
router.get('/technician-zone/:technicianId', verifyToken, getTechnicianZone);
router.post('/technician-assign-zone', verifyToken, assignTechnicianZone)
// router.post('/update/technician/:id', verifyToken, updateTechnician);
// router.delete('/delete/technician/:id', verifyToken, deleteTechnician);

export default router;