import express from "express";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import User from "../models/user.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post(
  "/profile",
  protect,
  upload.single("image"),
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { image: req.file.path },
      { new: true }
    );
    res.json({ message: "Image uploaded", user });
  }
);

export default router;
