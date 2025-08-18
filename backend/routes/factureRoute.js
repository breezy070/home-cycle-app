import express from 'express';
import { verifyToken, verifyRole } from '../utils/verifyUser.js';
import {test, fetchAllFactures } from '../controllers/factureController.js'

const router = express.Router();

router.get('/', test);

router.get('/getAllFactures/:userId', verifyToken, fetchAllFactures);




export default router;