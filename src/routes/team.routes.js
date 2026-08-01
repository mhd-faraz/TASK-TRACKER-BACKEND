import { Router } from "express";
import {
  createTeam,
  getMyTeams,
  getTeamById,
  joinTeam,
  updateTeam,
  removeMember,
} from "../controllers/team.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// All routes are protected
router.use(protect);

router.post("/", createTeam);
router.get("/", getMyTeams);
router.post("/join", joinTeam);
router.get("/:id", getTeamById);
router.put("/:id", updateTeam);
router.delete("/:id/members/:userId", removeMember);

export default router;