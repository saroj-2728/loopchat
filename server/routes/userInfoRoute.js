import express from 'express';
import { handleGetUser, handleUserCreation } from '../controllers/userInfoController.js';

const router = express.Router();

router.get('/get-user', handleGetUser);

router.post('/create-user', handleUserCreation);

export default router;