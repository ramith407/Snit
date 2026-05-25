import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const SnippetContext = createContext(null);

export function formatTimeAgo(dateInput) {
  if (!dateInput) return "";
  if (typeof dateInput === "string" && (dateInput.includes("ago") || dateInput.toLowerCase() === "yesterday")) {
    return dateInput;
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function computeDiff(oldCode, newCode) {
  const oldLines = (oldCode || "").split("\n");
  const newLines = (newCode || "").split("\n");
  const m = oldLines.length;
  const n = newLines.length;
  
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  const left = [];
  const right = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      left.unshift({ no: i, type: "same", text: oldLines[i - 1] });
      right.unshift({ no: j, type: "same", text: newLines[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      right.unshift({ no: j, type: "add", text: "+ " + newLines[j - 1] });
      j--;
    } else {
      left.unshift({ no: i, type: "remove", text: "- " + oldLines[i - 1] });
      i--;
    }
  }
  
  return { left, right };
}

const defaultNotifications = [
  { id: 1, text: "Welcome to Snit! Your snippet library is ready.", read: false, time: new Date().toISOString() },
  { id: 2, text: "Tip: Press Ctrl+K to open the command palette.", read: false, time: new Date().toISOString() },
];

export function SnippetProvider({ children }) {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);

  const fetchSnippets = useCallback(async () => {
    if (!user) {
      setSnippets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get("/snippets");
      setSnippets(data);
    } catch (err) {
      console.error("Failed to fetch snippets:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Sync snippets on login state changes
  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const addNotification = (text) => {
    setNotifications((prev) => [
      { id: Date.now(), text, read: false, time: new Date().toISOString() },
      ...prev,
    ]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => setNotifications([]);

  const createSnippet = async ({ title, language, description, code, tags, commitMessage }) => {
    try {
      const res = await api.post("/snippets", {
        title,
        language,
        description,
        code,
        tags,
        commitMessage,
      });
      if (res.success) {
        addNotification(`New snippet "${title}" was created.`);
        await fetchSnippets();
        return res.id; // Return slug/id
      }
    } catch (err) {
      console.error("Failed to create snippet on backend:", err.message);
      throw err;
    }
  };

  const addVersion = async (snippetId, message) => {
    try {
      const res = await api.post(`/snippets/${snippetId}/versions`, { message });
      if (res.success) {
        addNotification(`Version ${res.version.label} was created.`);
        await fetchSnippets();
      }
    } catch (err) {
      console.error("Failed to add version on backend:", err.message);
    }
  };

  const toggleFavorite = async (snippetId) => {
    // Optimistic toggle
    setSnippets((prev) =>
      prev.map((s) => {
        if (s.id !== snippetId) return s;
        return { ...s, favorite: !s.favorite };
      })
    );

    try {
      const res = await api.post(`/snippets/${snippetId}/favorite`);
      if (res.success) {
        const target = snippets.find((s) => s.id === snippetId);
        if (target) {
          addNotification(
            res.favorite
              ? `"${target.title}" added to favorites.`
              : `"${target.title}" removed from favorites.`
          );
        }
        await fetchSnippets();
      }
    } catch (err) {
      console.error("Failed to toggle favorite on backend:", err.message);
      // Revert on error
      await fetchSnippets();
    }
  };

  const deleteSnippet = async (snippetId) => {
    const target = snippets.find((s) => s.id === snippetId);

    setSnippets((prev) => prev.filter((s) => s.id !== snippetId));

    try {
      const res = await api.delete(`/snippets/${snippetId}`);
      if (res.success) {
        addNotification(`Snippet "${target?.title || snippetId}" was deleted.`);
        await fetchSnippets();
        return true;
      }
      throw new Error("Delete failed.");
    } catch (err) {
      console.error("Failed to delete snippet on backend:", err.message);
      await fetchSnippets();
      throw err;
    }
  };

  const searchSnippets = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return snippets;
    return snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.language.toLowerCase().includes(q) ||
        s.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  };

  const stats = useMemo(() => {
    const totalSnippets = snippets.length;
    const totalVersions = snippets.reduce((acc, s) => acc + (s.versions ? s.versions.length : 1), 0);

    const languageCounts = {};
    snippets.forEach((s) => {
      if (s.language) {
        languageCounts[s.language] = (languageCounts[s.language] || 0) + 1;
      }
    });

    let mostUsedLanguage = "None";
    let mostUsedPercent = 0;
    const languages = Object.keys(languageCounts);
    if (languages.length > 0) {
      mostUsedLanguage = languages.reduce((a, b) => (languageCounts[a] > languageCounts[b] ? a : b));
      mostUsedPercent = totalSnippets > 0 ? Math.round((languageCounts[mostUsedLanguage] / totalSnippets) * 100) : 0;
    }

    return {
      totalSnippets,
      totalVersions,
      mostUsedLanguage,
      mostUsedPercent,
    };
  }, [snippets]);

  return (
    <SnippetContext.Provider
      value={{
        snippets,
        loading,
        createSnippet,
        addVersion,
        toggleFavorite,
        deleteSnippet,
        searchSnippets,
        stats,
        notifications,
        addNotification,
        markAllNotificationsAsRead,
        clearNotifications,
      }}
    >
      {children}
    </SnippetContext.Provider>
  );
}


export function useSnippets() {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error("useSnippets must be used within a SnippetProvider");
  }
  return context;
}
