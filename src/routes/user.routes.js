import { Router } from "express";
import {
  getProfile,
  updateProfile,
  updateAvatar,
  updatePassword,
  getAllUsers,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";

const router = Router();

// All routes are protected
router.use(protect);

router.get("/", getAllUsers);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/avatar", uploadAvatar, updateAvatar);
router.put("/password", updatePassword);

export default router;