import { Router } from "express";
import {
  addComment,
  getTaskComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadAttachments } from "../middleware/upload.middleware.js";

const router = Router();

// All routes are protected
router.use(protect);

router.post("/:taskId/comments", uploadAttachments, addComment);
router.get("/:taskId/comments", getTaskComments);
router.put("/:taskId/comments/:commentId", updateComment);
router.delete("/:taskId/comments/:commentId", deleteComment);

export default router;