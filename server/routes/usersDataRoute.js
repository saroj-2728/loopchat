import express from "express";
import { handleALlUsersList } from "../controllers/allUsersDataController.js";

const router = express.Router();

router.get('/users', handleALlUsersList);

export default router;