import Groq from "groq-sdk";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Generate task description using AI
// @route   POST /api/ai/generate-description
// @access  Private
const generateTaskDescription = asyncHandler(async (req, res) => {
  const { title, context } = req.body;

  if (!title) {
    throw new ApiError(400, "Task title is required");
  }

  // Initialize client inside function
  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a professional project manager. Generate clear, concise, and actionable task descriptions.",
      },
      {
        role: "user",
        content: `Generate a clear and actionable task description for:
        Title: "${title}"
        ${context ? `Context: ${context}` : ""}
        
        Requirements:
        - 2-4 sentences only
        - Be specific and actionable
        - Professional tone
        - Return only the description, no extra text`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  const description = completion.choices[0].message.content;

  return res.status(200).json(
    new ApiResponse(
      200,
      { description },
      "Task description generated successfully"
    )
  );
});

// @desc    Generate task summary using AI
// @route   POST /api/ai/generate-summary
// @access  Private
const generateTaskSummary = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Task title and description are required");
  }

  // Initialize client inside function
  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a professional project manager. Generate brief and insightful task summaries.",
      },
      {
        role: "user",
        content: `Generate a brief summary for this task:
        
        Title: ${title}
        Description: ${description}
        Status: ${status || "todo"}
        Priority: ${priority || "medium"}
        Due Date: ${dueDate || "Not set"}
        
        Requirements:
        - One paragraph only
        - Highlight key points
        - Mention priority and timeline
        - Professional tone
        - Return only the summary, no extra text`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  const summary = completion.choices[0].message.content;

  return res.status(200).json(
    new ApiResponse(
      200,
      { summary },
      "Task summary generated successfully"
    )
  );
});

export { generateTaskDescription, generateTaskSummary };