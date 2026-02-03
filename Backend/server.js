import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

app.use("/uploads", express.static("uploads"));
app.use("/api/upload", uploadRoutes);


dotenv.config();
connectDB();

const app = express();

// REQUIRED
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
