import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE USER
router.post("/create", async (req, res) => {
  const { name, email, password } = req.body;

  const lastUser = await User.findOne().sort({ userId: -1 });
  const nextUserId = lastUser ? lastUser.userId + 1 : 1;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    userId: nextUserId,
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json(user);
});

// GET USERS (pagination + search)
router.get("/", protect, async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const users = await User.find({
    name: { $regex: search, $options: "i" },
  })
    .select("-password")
    .skip(skip)
    .limit(limit);

  res.json({ page, limit, users });
});

// UPDATE
router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(user);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

export default router;
