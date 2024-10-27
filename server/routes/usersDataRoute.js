import express from "express";
import { handleUsersList } from "../controllers/usersDataController.js";

const router = express.Router();

router.post('/users', handleUsersList);

export default router;