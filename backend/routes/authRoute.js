import express from 'express';
import { google, signin, signup, signout, signupTechnician, signinTechnician, signoutTechnician, test } from '../controllers/authController.js';

const router = express.Router();

router.get("/", test);
router.post("/signup", signup);
router.post("/signup/technician", signupTechnician);
router.post("/signin", signin);
router.post("/signin/technician", signinTechnician);
router.get("/signout", signout);
router.get("/signout/technician", signoutTechnician);
router.post("/google", google);


export default router;