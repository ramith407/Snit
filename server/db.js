import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  user: process.env.DB_USER || process.env.MYSQLUSER || "root",
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
};

let pool;

export async function initDB() {
  try {
    const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || "snit_db";
    console.log(`Connecting to MySQL at ${connectionConfig.host}:${connectionConfig.user}...`);
    
    // 1. Create DB if not exists
    const connection = await mysql.createConnection(connectionConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    // 2. Create the connection pool
    pool = mysql.createPool({
      ...connectionConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log(`Connected to MySQL database: ${dbName}`);

    // 3. Run schema.sql statements
    const schemaPath = path.join(__dirname, "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, "utf8");
      
      // Clean up comments and execute statements
      const cleanSql = schemaSql
        .replace(/--.*$/gm, "") // remove comments
        .replace(/\/\*[\s\S]*?\*\//g, ""); // remove block comments
        
      const statements = cleanSql
        .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        if (!statement.toLowerCase().startsWith("create database") && !statement.toLowerCase().startsWith("use")) {
          await pool.query(statement);
        }
      }
      console.log("Database tables verified/created successfully.");
    }

    // 4. Seed user & snippets if users table is empty
    const [usersRows] = await pool.query("SELECT COUNT(*) as count FROM users");
    if (usersRows[0].count === 0) {
      console.log("Seeding initial mock data...");
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("password", salt);

      const [userResult] = await pool.query(
        `INSERT INTO users (name, handle, email, password_hash, plan, role, bio, avatar_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Alex Mercer",
          "@amercer_dev",
          "dev@snit.io",
          passwordHash,
          "PRO",
          "Full-stack engineer building tools",
          "Full-stack engineer building tools for high-performance workflows. Obsessed with React, Rust, and reducing cognitive overhead.",
          "",
        ]
      );
      const userId = userResult.insertId;

      const mockSnippets = [
        {
          slug: "jwt-auth-middleware",
          title: "JWT Authentication Middleware",
          file_name: "authMiddleware.ts",
          language: "TypeScript",
          language_short: "TS",
          description: "A robust Express middleware for verifying JSON Web Tokens, handling extraction from headers or cookies, and attaching user payload to the request object.",
          tags: ["express", "auth", "security"],
          favorite: true,
          views: 1204,
          forks: 42,
          code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Extract token from Authorization header or cookies
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. Please provide a valid token.'
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Attach user payload to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({
      error: 'Invalid or expired token.'
    });
  }
};`,
          versions: [
            { label: "v1.2.0", message: "Added support for cookie-based token extraction.", author: "alex_dev", is_current: true },
            { label: "v1.1.0", message: "Refactored error handling logic.", author: "sarah_codes", is_current: false },
            { label: "v1.0.0", message: "Initial implementation.", author: "alex_dev", is_current: false },
          ],
        },
        {
          slug: "use-debounce-hook",
          title: "useDebounce Hook",
          file_name: "useDebounce.ts",
          language: "TypeScript",
          language_short: "TS",
          description: "React custom hook for debouncing input values.",
          tags: ["react", "hooks"],
          favorite: false,
          views: 89,
          forks: 2,
          code: `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
          versions: [
            { label: "v1.0.0", message: "Initial hook implementation.", author: "alex_dev", is_current: true },
          ],
        },
        {
          slug: "glassmorphism-mixin",
          title: "Glassmorphism Mixin",
          file_name: "_glass.scss",
          language: "SCSS",
          language_short: "SCSS",
          description: "SCSS mixin for generating blurred frosted glass layers.",
          tags: ["css", "design"],
          favorite: false,
          views: 312,
          forks: 14,
          code: `@mixin glass-panel($alpha: 0.72) {
  background: rgba(20, 24, 34, $alpha);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);
}`,
          versions: [
            { label: "v1.0.0", message: "frosted glass design style.", author: "alex_dev", is_current: true },
          ],
        },
      ];

      for (const snippet of mockSnippets) {
        const [snipResult] = await pool.query(
          `INSERT INTO snippets (slug, title, file_name, language, language_short, description, user_id, favorite, views, forks, code)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            snippet.slug,
            snippet.title,
            snippet.file_name,
            snippet.language,
            snippet.language_short,
            snippet.description,
            userId,
            snippet.favorite,
            snippet.views,
            snippet.forks,
            snippet.code,
          ]
        );
        const snippetId = snipResult.insertId;

        for (const tag of snippet.tags) {
          await pool.query("INSERT INTO snippet_tags (snippet_id, tag) VALUES (?, ?)", [
            snippetId,
            tag,
          ]);
        }

        for (const v of snippet.versions) {
          await pool.query(
            `INSERT INTO versions (snippet_id, label, message, author, code, is_current)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [snippetId, v.label, v.message, v.author, snippet.code, v.is_current],
          );
        }
      }
      console.log("Mock data seeded successfully.");
    }
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    console.warn("Please make sure your MySQL database is active and check your password in .env.");
    throw error;
  }
}

export function query(sql, params) {
  if (!pool) {
    throw new Error("Database connection pool has not been initialized.");
  }
  return pool.query(sql, params);
}

export default {
  query,
  initDB,
  get pool() {
    return pool;
  },
};
