import Task from "../models/Task.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo, team, tags } = req.body;

  if (!title) {
    throw new ApiError(400, "Task title is required");
  }

  // Handle attachments
  const attachments = req.files
    ? req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
        filename: file.originalname,
      }))
    : [];

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    team,
    tags,
    attachments,
    createdBy: req.user._id,
  });

  await task.populate([
    { path: "createdBy", select: "name email avatar" },
    { path: "assignedTo", select: "name email avatar" },
    { path: "team", select: "name" },
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getAllTasks = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    assignedTo,
    team,
    search,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = req.query;

  // Build filter
  const filter = { isActive: true };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (team) filter.team = team;

  // Search by title or description
  if (search) {
    filter.$text = { $search: search };
  }

  // Only show tasks created by or assigned to the user
  filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const tasks = await Task.find(filter)
    .populate("createdBy", "name email avatar")
    .populate("assignedTo", "name email avatar")
    .populate("team", "name")
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(Number(limit));

  const total = await Task.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tasks,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
      "Tasks fetched successfully"
    )
  );
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("createdBy", "name email avatar")
    .populate("assignedTo", "name email avatar")
    .populate("team", "name");

  if (!task || !task.isActive) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || !task.isActive) {
    throw new ApiError(404, "Task not found");
  }

  // Only creator or assigned user can update
  if (
    task.createdBy.toString() !== req.user._id.toString() &&
    task.assignedTo?.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Not authorized to update this task");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  )
    .populate("createdBy", "name email avatar")
    .populate("assignedTo", "name email avatar")
    .populate("team", "name");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || !task.isActive) {
    throw new ApiError(404, "Task not found");
  }

  // Only creator can delete
  if (task.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this task");
  }

  // Soft delete
  task.isActive = false;
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

// @desc    Mark task as completed
// @route   PATCH /api/tasks/:id/complete
// @access  Private
const markTaskComplete = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || !task.isActive) {
    throw new ApiError(404, "Task not found");
  }

  task.status = "completed";
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task marked as completed"));
});

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  markTaskComplete,
};