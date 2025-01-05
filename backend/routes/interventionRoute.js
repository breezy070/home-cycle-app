import express from 'express';
import { verifyToken, verifyRole } from '../utils/verifyUser.js';
import {test, fetchInterventionComments, addInterventionComment} from '../controllers/interventionController.js'

const router = express.Router();

router.get('/', test);
// router.get('/technicians', verifyToken, verifyRole('admin'), getAllTechnicians);

//comment routes
router.get('/intervention-comments/:id/comments', verifyToken, fetchInterventionComments); //fetch comments
router.post('/intervention-comments/:id/comments', verifyToken, addInterventionComment); //add a comment



export default router;