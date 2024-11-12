import express from "express";
import { handleALlUsersList } from "../controllers/allUsersDataController.js";

const router = express.Router();

router.post('/users', handleALlUsersList);

export default router;