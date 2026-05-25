import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import snippetRoutes from "./routes/snippets.js";
import versionRoutes from "./routes/versions.js";
import userRoutes from "./routes/users.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

// Middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mounting routes
app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/snippets/:snippetId/versions", versionRoutes);
app.use("/api/users", userRoutes);

// Basic health check route
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Initialize database and start the server
async function startServer() {
  await initDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Snit API Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
