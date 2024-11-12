import express from "express";
import { handleProfileSetUp } from "../controllers/profileSetUpController.js";
import upload from "../multer/multerConfig.js";

const router = express.Router();

router.put('/profile-setup', upload.single('profileImage'),  handleProfileSetUp);

export default router;