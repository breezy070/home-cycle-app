import express from 'express';
import { getAllTechnicians, getTechnicianZone, getAllTechnicianZones ,assignTechnicianZone, getAllAdmins, getAllClients, getAllInterventions, getClientById, updateAdmin, deleteIntervention, addUsers } from '../controllers/adminController.js';
import { verifyToken, verifyRole } from '../utils/verifyUser.js';

const router = express.Router();

// router.get('/');
router.get('/technicians', verifyToken, verifyRole('admin'), getAllTechnicians);
router.get('/get-admins', verifyToken, verifyRole('admin'), getAllAdmins);
router.get('/get-clients', verifyToken, verifyRole('admin'), getAllClients);
router.get('/get-client-by-id/:id', verifyToken, verifyRole('admin'), getClientById)
router.post('/add-users', verifyToken, verifyRole('admin'), addUsers)
// router.post('/update-client-by-id/:id', verifyToken,verifyRole, updateUserById);
router.get('/get-interventions', verifyToken, verifyRole('admin'), getAllInterventions);
router.delete('/delete-intervention/:id', verifyToken, verifyRole('admin'), deleteIntervention);
router.get('/technician-zone/:technicianId', verifyToken, getTechnicianZone);
router.get('/technician-zones', verifyToken, getAllTechnicianZones);
router.post('/technician-assign-zone', verifyToken, assignTechnicianZone)
router.post('/update/:id',verifyToken, updateAdmin )

// router.post('/update/technician/:id', verifyToken, updateTechnician);
// router.delete('/delete/technician/:id', verifyToken, deleteTechnician);

export default router;