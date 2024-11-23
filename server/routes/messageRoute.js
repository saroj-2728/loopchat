import express from 'express';
import getMessages from '../controllers/messageController.js';
import { authenticateFirebaseToken } from '../middlewares/verifyFirebaseToken.js';

const router = express.Router();

router.get('/messages/:userId/:contactId', authenticateFirebaseToken, getMessages)

export default router;