import Comment from "../models/Comment.model.js";
import Task from "../models/Task.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Add comment to task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { taskId } = req.params;

  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task || !task.isActive) {
    throw new ApiError(404, "Task not found");
  }

  // Handle attachments
  const attachments = req.files
    ? req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
        filename: file.originalname,
      }))
    : [];

  const comment = await Comment.create({
    content,
    task: taskId,
    author: req.user._id,
    attachments,
  });

  await comment.populate("author", "name email avatar");

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// @desc    Get all comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
const getTaskComments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task || !task.isActive) {
    throw new ApiError(404, "Task not found");
  }

  const comments = await Comment.find({ task: taskId })
    .populate("author", "name email avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

// @desc    Update comment
// @route   PUT /api/tasks/:taskId/comments/:commentId
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Only author can update
  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this comment");
  }

  comment.content = content;
  comment.isEdited = true;
  await comment.save();

  await comment.populate("author", "name email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

// @desc    Delete comment
// @route   DELETE /api/tasks/:taskId/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Only author can delete
  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { addComment, getTaskComments, updateComment, deleteComment };