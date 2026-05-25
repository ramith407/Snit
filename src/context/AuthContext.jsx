import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("snit_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Sync session on load
  useEffect(() => {
    async function checkSession() {
      const token = localStorage.getItem("snit_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await api.get("/auth/me");
        setUser(currentUser);
        localStorage.setItem("snit_user", JSON.stringify(currentUser));
      } catch (err) {
        console.error("Session restoration failed:", err.message);
        // If session invalid, clear auth
        logout();
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.success) {
        localStorage.setItem("snit_token", res.token);
        localStorage.setItem("snit_user", JSON.stringify(res.user));
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (err) {
      return { success: false, error: err.message || "Login failed" };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      if (res.success) {
        localStorage.setItem("snit_token", res.token);
        localStorage.setItem("snit_user", JSON.stringify(res.user));
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: "Signup failed" };
    } catch (err) {
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("snit_user");
    localStorage.removeItem("snit_token");
  };

  const updateUser = async (updatedFields) => {
    try {
      // Optimistically update
      setUser((prev) => {
        if (!prev) return null;
        const nextUser = { ...prev, ...updatedFields };
        localStorage.setItem("snit_user", JSON.stringify(nextUser));
        return nextUser;
      });

      // Call API
      const res = await api.put("/users/me", updatedFields);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem("snit_user", JSON.stringify(res.user));
      }
    } catch (err) {
      console.error("Failed to update profile on backend:", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

