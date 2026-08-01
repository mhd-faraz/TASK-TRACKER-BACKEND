import Team from "../models/Team.model.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { v4 as uuidv4 } from "uuid";

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Team name is required");
  }

  const team = await Team.create({
    name,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "admin" }],
    inviteCode: uuidv4().slice(0, 8).toUpperCase(),
  });

  // Add team to user's teams
  await User.findByIdAndUpdate(req.user._id, {
    $push: { teams: team._id },
  });

  await team.populate("owner", "name email avatar");

  return res
    .status(201)
    .json(new ApiResponse(201, team, "Team created successfully"));
});

// @desc    Get all teams for current user
// @route   GET /api/teams
// @access  Private
const getMyTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({
    "members.user": req.user._id,
    isActive: true,
  })
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, teams, "Teams fetched successfully"));
});

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  if (!team || !team.isActive) {
    throw new ApiError(404, "Team not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, team, "Team fetched successfully"));
});

// @desc    Join team via invite code
// @route   POST /api/teams/join
// @access  Private
const joinTeam = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    throw new ApiError(400, "Invite code is required");
  }

  const team = await Team.findOne({ inviteCode, isActive: true });

  if (!team) {
    throw new ApiError(404, "Invalid invite code");
  }

  // Check if already a member
  const isMember = team.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (isMember) {
    throw new ApiError(400, "You are already a member of this team");
  }

  // Add user to team
  team.members.push({ user: req.user._id, role: "member" });
  await team.save();

  // Add team to user's teams
  await User.findByIdAndUpdate(req.user._id, {
    $push: { teams: team._id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, team, "Joined team successfully"));
});

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team || !team.isActive) {
    throw new ApiError(404, "Team not found");
  }

  // Only owner can update
  if (team.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this team");
  }

  const updatedTeam = await Team.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  )
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTeam, "Team updated successfully"));
});

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private
const removeMember = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team || !team.isActive) {
    throw new ApiError(404, "Team not found");
  }

  // Only owner can remove members
  if (team.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to remove members");
  }

  team.members = team.members.filter(
    (member) => member.user.toString() !== req.params.userId
  );
  await team.save();

  // Remove team from user's teams
  await User.findByIdAndUpdate(req.params.userId, {
    $pull: { teams: team._id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Member removed successfully"));
});

export {
  createTeam,
  getMyTeams,
  getTeamById,
  joinTeam,
  updateTeam,
  removeMember,
};