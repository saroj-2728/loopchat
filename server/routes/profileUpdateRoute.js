import express from "express";
import { handleProfileUpdate } from "../controllers/profileUpdateController.js";
import upload from "../multer/multerConfig.js";

const router = express.Router();

router.put('/:prevUser/update-profile', upload.single('profileImage'),  handleProfileUpdate);

export default router;