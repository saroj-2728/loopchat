import express from "express";
import { handleDeleteProfile } from "../controllers/profileDeletionController.js";
import { handleProfileUpdate } from "../controllers/profileUpdateController.js";
import { handleProfileSetUp } from "../controllers/profileSetUpController.js";
import { authenticateFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import upload from "../multer/multerConfig.js";

const router = express.Router();

router.delete('/delete-profile', authenticateFirebaseToken, handleDeleteProfile);

router.put('/update-profile', authenticateFirebaseToken, upload.single('profileImage'), handleProfileUpdate);

router.put('/profile-setup', authenticateFirebaseToken, upload.single('profileImage'), handleProfileSetUp);

export default router;