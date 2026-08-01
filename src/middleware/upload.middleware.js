import multer from "multer";
import { attachmentStorage, avatarStorage } from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

// File size limit: 5MB
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// Upload avatar
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Only JPG and PNG images are allowed for avatar"));
    }
  },
}).single("avatar");

// Upload task attachments (max 5 files)
const uploadAttachments = multer({
  storage: attachmentStorage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "File type not allowed"));
    }
  },
}).array("attachments", 5);

export { uploadAvatar, uploadAttachments };