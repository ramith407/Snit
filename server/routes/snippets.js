import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get file extension from language name
function getFileExtension(language) {
  const map = {
    TypeScript: "ts",
    JavaScript: "js",
    SCSS: "scss",
    CSS: "css",
    HTML: "html",
    YAML: "yml",
    Python: "py",
    Rust: "rs",
    Go: "go",
    RegEx: "txt",
  };
  return map[language] || "txt";
}

// 1. Get all snippets for current user
router.get("/", requireAuth, async (req, res) => {
  try {
    // Fetch snippets from the library view, which already joins owner and tag summary data.
    const [snippets] = await db.query(
      "SELECT * FROM v_snippet_library WHERE user_id = ? ORDER BY updated_at DESC",
      [req.user.id]
    );

    if (snippets.length === 0) {
      return res.json([]);
    }

    const snippetIds = snippets.map((s) => s.snippet_id);

    // Fetch all versions for these snippets
    const [versions] = await db.query(
      "SELECT * FROM versions WHERE snippet_id IN (?) ORDER BY created_at DESC",
      [snippetIds]
    );

    // Map everything together
    const formatted = snippets.map((s) => {
      const sTags = s.tags ? s.tags.split(",").filter(Boolean) : [];
      const sVersions = versions
        .filter((v) => v.snippet_id === s.snippet_id)
        .map((v) => ({
          id: v.label,
          label: v.label,
          current: v.is_current === 1 || v.is_current === true,
          date: v.created_at,
          message: v.message,
          author: v.author,
          code: v.code,
        }));

      return {
        dbId: s.snippet_id,
        id: s.slug, // Map slug to id for React routing
        slug: s.slug,
        title: s.title,
        fileName: s.file_name,
        language: s.language,
        languageShort: s.language_short,
        description: s.description,
        tags: sTags,
        favorite: s.favorite === 1 || s.favorite === true,
        views: s.views.toString(),
        forks: s.forks.toString(),
        code: s.code,
        versions: sVersions,
        updatedAt: s.updated_at,
        createdAt: s.created_at,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Fetch snippets error:", error);
    res.status(500).json({ error: "Failed to fetch snippets." });
  }
});

// 2. Create a snippet
router.post("/", requireAuth, async (req, res) => {
  const { title, language, description, code, tags, commitMessage } = req.body;

  if (!title || !language || !code) {
    return res.status(400).json({ error: "Title, language, and code are required." });
  }

  try {
    // Generate clean slug
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let slug = baseSlug || "snippet";
    let counter = 1;

    // Check slug uniqueness
    while (true) {
      const [existing] = await db.query("SELECT id FROM snippets WHERE slug = ?", [slug]);
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const languageShort = language.substring(0, 2).toUpperCase();
    const ext = getFileExtension(language);
    const fileName = `${slug}.${ext}`;

    // 1. Insert snippet
    const [result] = await db.query(
      `INSERT INTO snippets (slug, title, file_name, language, language_short, description, user_id, favorite, views, forks, code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [slug, title, fileName, language, languageShort, description || "", req.user.id, false, 0, 0, code]
    );

    const snippetId = result.insertId;

    // 2. Insert tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        if (tag && tag.trim()) {
          await db.query(
            "INSERT INTO snippet_tags (snippet_id, tag) VALUES (?, ?)",
            [snippetId, tag.trim()]
          );
        }
      }
    }

    // 3. Insert initial version
    const label = "v1.0.0";
    const msg = commitMessage || "Initial commit";
    const author = req.user.handle.replace("@", "") || "developer";
    await db.query(
      `INSERT INTO versions (snippet_id, label, message, author, code, is_current)
       VALUES (?, ?, ?, ?, ?, true)`,
      [snippetId, label, msg, author, code]
    );

    res.status(201).json({
      success: true,
      id: slug,
      slug,
      dbId: snippetId,
    });
  } catch (error) {
    console.error("Create snippet error:", error);
    res.status(500).json({ error: "Failed to create snippet." });
  }
});

// 3. Toggle favorite
router.post("/:id/favorite", requireAuth, async (req, res) => {
  const { id } = req.params; // Could be numerical dbId or slug string
  try {
    let snippetId;
    let currentFavorite;

    // Determine query strategy
    if (isNaN(id)) {
      const [rows] = await db.query("SELECT id, favorite FROM snippets WHERE slug = ? AND user_id = ?", [id, req.user.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Snippet not found." });
      snippetId = rows[0].id;
      currentFavorite = rows[0].favorite;
    } else {
      const [rows] = await db.query("SELECT id, favorite FROM snippets WHERE id = ? AND user_id = ?", [parseInt(id), req.user.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Snippet not found." });
      snippetId = rows[0].id;
      currentFavorite = rows[0].favorite;
    }

    const newFavorite = !currentFavorite;
    await db.query("UPDATE snippets SET favorite = ? WHERE id = ?", [newFavorite, snippetId]);

    res.json({ success: true, favorite: newFavorite });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ error: "Failed to toggle favorite." });
  }
});

// 4. Update snippet details or code
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, code, favorite } = req.body;

  try {
    // Find snippet
    let snippet;
    if (isNaN(id)) {
      const [rows] = await db.query("SELECT * FROM snippets WHERE slug = ? AND user_id = ?", [id, req.user.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Snippet not found." });
      snippet = rows[0];
    } else {
      const [rows] = await db.query("SELECT * FROM snippets WHERE id = ? AND user_id = ?", [parseInt(id), req.user.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Snippet not found." });
      snippet = rows[0];
    }

    const updatedTitle = title !== undefined ? title : snippet.title;
    const updatedDesc = description !== undefined ? description : snippet.description;
    const updatedCode = code !== undefined ? code : snippet.code;
    const updatedFav = favorite !== undefined ? favorite : snippet.favorite;

    await db.query(
      `UPDATE snippets 
       SET title = ?, description = ?, code = ?, favorite = ? 
       WHERE id = ?`,
      [updatedTitle, updatedDesc, updatedCode, updatedFav, snippet.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Update snippet error:", error);
    res.status(500).json({ error: "Failed to update snippet." });
  }
});

// 5. Delete snippet
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let affectedRows = 0;
    if (isNaN(id)) {
      const [result] = await db.query("DELETE FROM snippets WHERE slug = ? AND user_id = ?", [id, req.user.id]);
      affectedRows = result.affectedRows;
    } else {
      const [result] = await db.query("DELETE FROM snippets WHERE id = ? AND user_id = ?", [parseInt(id), req.user.id]);
      affectedRows = result.affectedRows;
    }

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Snippet not found or unauthorized." });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete snippet error:", error);
    res.status(500).json({ error: "Failed to delete snippet." });
  }
});

export default router;
