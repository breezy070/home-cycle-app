import express from 'express';
import { google, signin, signup, signout, signupTechnician, signinTechnician, signoutTechnician, signupAdmin, test, signinAdmin } from '../controllers/authController.js';

const router = express.Router();

router.get("/", test);
router.post("/signup", signup);
router.post("/signup/technician", signupTechnician);
router.post("/signup/admin", signupAdmin);

router.post("/signin", signin);
router.post("/signin/technician", signinTechnician);
router.post("/signin/admin", signinAdmin);

router.get("/signout", signout);
router.get("/signout/technician", signoutTechnician);
router.post("/google", google);


export default router;