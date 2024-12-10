import express from 'express';
import { getAllTechnicians, getTechnicianZone, getAllTechnicianZones ,assignTechnicianZone } from '../controllers/adminController.js';
import { verifyToken, verifyRole } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/');
router.get('/technicians', verifyToken, verifyRole('admin'), getAllTechnicians);
router.get('/technician-zone/:technicianId', verifyToken, getTechnicianZone);
router.get('/technician-zones', verifyToken, getAllTechnicianZones);
router.post('/technician-assign-zone', verifyToken, assignTechnicianZone)
// router.post('/update/technician/:id', verifyToken, updateTechnician);
// router.delete('/delete/technician/:id', verifyToken, deleteTechnician);

export default router;