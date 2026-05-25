import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

// 1. Get all versions for a snippet
router.get("/", requireAuth, async (req, res) => {
  const { snippetId } = req.params; // slug or dbId

  try {
    let snippet;
    if (isNaN(snippetId)) {
      const [rows] = await db.query("SELECT id FROM snippets WHERE slug = ? AND user_id = ?", [snippetId, req.user.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Snippet not found." });
      snippet = rows[0];
    } else {
      const [rows] = await db.query("SELECT id FROM snippets WHERE id = ? AND user_id = ?", [parseInt(snippetId), req.user.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Snippet not found." });
      snippet = rows[0];
    }

    const [versions] = await db.query(
      "SELECT * FROM versions WHERE snippet_id = ? ORDER BY created_at DESC",
      [snippet.id]
    );

    const formatted = versions.map((v) => ({
      id: v.label,
      label: v.label,
      current: v.is_current === 1 || v.is_current === true,
      date: v.created_at,
      message: v.message,
      author: v.author,
      code: v.code,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Fetch versions error:", error);
    res.status(500).json({ error: "Failed to fetch versions." });
  }
});

// 2. Add a new version to a snippet
router.post("/", requireAuth, async (req, res) => {
  const { snippetId } = req.params; // slug or dbId
  const { message, code } = req.body;

  try {
    let snippet;
    if (isNaN(snippetId)) {
      const [rows] = await db.query("SELECT * FROM snippets WHERE slug = ? AND user_id = ?", [snippetId, req.user.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Snippet not found." });
      snippet = rows[0];
    } else {
      const [rows] = await db.query("SELECT * FROM snippets WHERE id = ? AND user_id = ?", [parseInt(snippetId), req.user.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Snippet not found." });
      snippet = rows[0];
    }

    // Determine next version label (e.g. v1.0.X)
    const [countRows] = await db.query("SELECT COUNT(*) as count FROM versions WHERE snippet_id = ?", [snippet.id]);
    const versionCount = countRows[0].count;
    const label = `v1.0.${versionCount}`;

    // Mark previous versions as NOT current
    await db.query("UPDATE versions SET is_current = false WHERE snippet_id = ?", [snippet.id]);

    // Use passed code or default to snippet's current code
    const versionCode = code !== undefined ? code : snippet.code;

    const author = req.user.handle.replace("@", "") || "developer";

    // Insert new version
    await db.query(
      `INSERT INTO versions (snippet_id, label, message, author, code, is_current)
       VALUES (?, ?, ?, ?, ?, true)`,
      [snippet.id, label, message || `Updated code version ${label}`, author, versionCode]
    );

    // If custom code was passed, we should also update the snippet's main code
    if (code !== undefined) {
      await db.query("UPDATE snippets SET code = ? WHERE id = ?", [code, snippet.id]);
    }

    res.status(201).json({
      success: true,
      version: {
        id: label,
        label,
        current: true,
        date: new Date().toISOString(),
        message: message || `Updated code version ${label}`,
        author,
        code: versionCode,
      },
    });
  } catch (error) {
    console.error("Create version error:", error);
    res.status(500).json({ error: "Failed to create version." });
  }
});

export default router;
