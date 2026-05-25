import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Update current user profile
router.put("/me", requireAuth, async (req, res) => {
  const { name, bio, avatarUrl } = req.body;

  try {
    // Fetch current user details first
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const currentUser = rows[0];

    const updatedName = name !== undefined ? name : currentUser.name;
    const updatedBio = bio !== undefined ? bio : currentUser.bio;
    const updatedAvatar = avatarUrl !== undefined ? avatarUrl : currentUser.avatar_url;

    // Execute update
    await db.query(
      `UPDATE users 
       SET name = ?, bio = ?, avatar_url = ? 
       WHERE id = ?`,
      [updatedName, updatedBio, updatedAvatar, req.user.id]
    );

    res.json({
      success: true,
      user: {
        id: currentUser.id,
        name: updatedName,
        handle: currentUser.handle,
        email: currentUser.email,
        plan: currentUser.plan,
        role: currentUser.role,
        bio: updatedBio,
        avatarUrl: updatedAvatar,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

export default router;
