import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  markTaskComplete,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadAttachments } from "../middleware/upload.middleware.js";

const router = Router();

// All routes are protected
router.use(protect);

router.post("/", uploadAttachments, createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/complete", markTaskComplete);

export default router;