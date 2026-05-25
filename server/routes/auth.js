import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "snit-super-secret-jwt-key-2026";

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    // 1. Check if email already registered
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // 2. Generate handle
    const handle = "@" + name.toLowerCase().replace(/[^a-z0-9]+/g, "_");

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create user
    const [result] = await db.query(
      `INSERT INTO users (name, handle, email, password_hash, plan, role, bio, avatar_url)
       VALUES (?, ?, ?, ?, 'FREE', 'Developer', '', '')`,
      [name, handle, email, passwordHash]
    );

    const userId = result.insertId;

    // 5. Generate token
    const token = jwt.sign({ id: userId, email, handle, name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name,
        handle,
        email,
        plan: "FREE",
        role: "Developer",
        bio: "",
        avatarUrl: "",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "An error occurred during registration." });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // 1. Find user by email
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "User not found. Please sign up." });
    }

    const user = rows[0];

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, handle: user.handle, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        handle: user.handle,
        email: user.email,
        plan: user.plan,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
});

// Get current user profile from token
router.get("/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = rows[0];
    res.json({
      id: user.id,
      name: user.name,
      handle: user.handle,
      email: user.email,
      plan: user.plan,
      role: user.role,
      bio: user.bio,
      avatarUrl: user.avatar_url,
    });
  } catch (error) {
    console.error("Fetch current user error:", error);
    res.status(500).json({ error: "Failed to fetch user session." });
  }
});

export default router;
