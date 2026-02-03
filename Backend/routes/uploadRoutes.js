import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.js";

const router = express.Router();

// storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${file.originalname}`
    );
  },
});

// file filter (images only)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// 🔒 Upload profile picture
router.post(
  "/profile",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { image: req.file.path },
        { new: true }
      );

      res.json({
        success: true,
        message: "Profile image uploaded",
        imagePath: req.file.path,
        user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
