import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      error: "Authentication required. Please log in.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "snit-super-secret-jwt-key-2026");
    req.user = decoded; // { id, email, handle, name }
    next();
  } catch (err) {
    return res.status(403).json({
      error: "Invalid or expired session. Please log in again.",
    });
  }
};
