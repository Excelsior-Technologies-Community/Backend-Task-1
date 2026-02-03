import express from "express";
import User from "../models/user.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 GET ALL USERS
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
