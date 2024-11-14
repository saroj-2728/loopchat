import express from 'express';
import getMessages from '../controllers/messageController.js';

const router = express.Router();

router.get('/messages/:userId/:contactId', getMessages)

export default router;