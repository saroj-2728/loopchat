import express from 'express';
import { handleLogin, handleRegister, handleCheckUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', handleLogin);

router.post('/register', handleRegister);

router.get('/check-user', handleCheckUser)

export default router;