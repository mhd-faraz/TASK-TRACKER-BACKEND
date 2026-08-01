import { Router } from "express";
import {
  generateTaskDescription,
  generateTaskSummary,
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// All routes are protected
router.use(protect);

router.post("/generate-description", generateTaskDescription);
router.post("/generate-summary", generateTaskSummary);

export default router;