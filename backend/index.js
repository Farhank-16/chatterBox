import express from "express";
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./Routes/authUser.js";
import messageRouter from "./Routes/messageRoute.js";
import userRouter from "./Routes/userRoute.js";
import cookieParser from "cookie-parser";
import path from "path";
import { app, server } from "./Socket/socket.js"; // yaha se socket ka app aur server aa raha hai

import cors from "cors";

dotenv.config();

// ✅ __dirname fix for ES module
const __dirname = path.resolve();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup (important for frontend)
app.use(
  cors({
    origin: "http://localhost:5173", //  React frontend  dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

// ✅ Serve frontend (production build)
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// ✅ Port
const PORT = process.env.PORT || 3000;

// ✅ Start server only after DB connect
dbConnect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB, server not started", err);
  });
