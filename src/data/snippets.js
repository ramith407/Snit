import avatarUrl from "../assets/avatar.svg";

export const currentUser = {
  name: "Alex Mercer",
  handle: "@amercer_dev",
  plan: "PRO",
  role: "Full-stack engineer building tools for high-performance workflows.",
  bio: "Full-stack engineer building tools for high-performance workflows. Obsessed with React, Rust, and reducing cognitive overhead.",
  avatarUrl,
  website: "snit.dev/alex",
};

export const stats = [
  {
    label: "Total Snippets",
    value: "1,248",
    detail: "+12 this week",
    tone: "blue",
    icon: "Braces",
  },
  {
    label: "Total Versions",
    value: "3,892",
    detail: "Across all snippets",
    tone: "purple",
    icon: "History",
  },
  {
    label: "Most Used Language",
    value: "TypeScript",
    detail: "45% of total repository",
    tone: "amber",
    icon: "Code2",
  },
];

export const snippets = [
  {
    id: "jwt-auth-middleware",
    title: "JWT Authentication Middleware",
    fileName: "authMiddleware.ts",
    language: "TypeScript",
    languageShort: "TS",
    description:
      "A robust Express middleware for verifying JSON Web Tokens, handling extraction from headers or cookies, and attaching user payload to the request object.",
    tags: ["express", "auth", "security"],
    updatedAt: "2 hours ago",
    favorite: true,
    views: "1,204",
    forks: "42",
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
      {
        id: "v1.2.0",
        label: "v1.2.0",
        current: true,
        date: "2h ago",
        message: "Added support for cookie-based token extraction.",
        author: "alex_dev",
      },
      {
        id: "v1.1.0",
        label: "v1.1.0",
        date: "Yesterday",
        message: "Refactored error handling logic.",
        author: "sarah_codes",
      },
      {
        id: "v1.0.0",
        label: "v1.0.0",
        date: "Oct 12, 2023",
        message: "Initial implementation.",
        author: "alex_dev",
      },
    ],
  },
  {
    id: "use-debounce-hook",
    title: "useDebounce Hook",
    fileName: "useDebounce.ts",
    language: "TypeScript",
    languageShort: "JS",
    description: "React custom hook for debouncing input values.",
    tags: ["react", "hooks"],
    updatedAt: "2 hours ago",
    favorite: false,
    code: `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
  },
  {
    id: "glassmorphism-mixin",
    title: "Glassmorphism Mixin",
    fileName: "_glass.scss",
    language: "SCSS",
    languageShort: "CSS",
    description: "SCSS mixin for generating blurred frosted glass layers.",
    tags: ["css", "design"],
    updatedAt: "Yesterday",
    favorite: false,
    code: `@mixin glass-panel($alpha: 0.72) {
  background: rgba(20, 24, 34, $alpha);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);
}`,
  },
  {
    id: "docker-compose-dev-env",
    title: "Docker Compose Dev Env",
    fileName: "docker-compose.yml",
    language: "YAML",
    languageShort: "YAML",
    description: "Standardized node and postgres docker-compose setup.",
    tags: ["devops", "postgres"],
    updatedAt: "3 days ago",
    favorite: false,
    code: `services:
  api:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: snit
      POSTGRES_PASSWORD: snit_dev`,
  },
  {
    id: "tailwind-grid-preset",
    title: "Tailwind Grid Preset",
    fileName: "gridPreset.js",
    language: "HTML/CSS",
    languageShort: "CSS",
    description: "Complex CSS grid layouts using responsive Tailwind utilities.",
    tags: ["tailwind", "layout"],
    updatedAt: "4 days ago",
    favorite: true,
    code: `export const dashboardGrid =
  "grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1.3fr_0.7fr]";`,
  },
  {
    id: "api-error-handler",
    title: "API Error Handler",
    fileName: "errors.py",
    language: "Python",
    languageShort: "PY",
    description: "Global error handling utility for API endpoints.",
    tags: ["python", "api"],
    updatedAt: "5 days ago",
    favorite: true,
    code: `class ApiError(Exception):
    def __init__(self, message, status_code=500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)`,
  },
  {
    id: "regex-email-validator",
    title: "Regex Email Val",
    fileName: "email.ts",
    language: "RegEx",
    languageShort: "RE",
    description: "Comprehensive regular expression for email validation.",
    tags: ["regex", "validation"],
    updatedAt: "1 week ago",
    favorite: true,
    code: `export const emailPattern =
  /^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,}$/;`,
  },
];

export const languageDistribution = [
  { label: "TypeScript", value: 45, color: "#aac0ff" },
  { label: "Rust", value: 30, color: "#d9adff" },
  { label: "Python", value: 15, color: "#ffad72" },
  { label: "Other", value: 10, color: "#5f687a" },
];

export const favoriteTags = ["react", "hooks", "rust-lang", "algorithms", "css-tricks"];

export const recentProfileEdits = [
  {
    title: "useDebounce Hook",
    meta: "React - Updated 2h ago",
    icon: "Braces",
    tone: "blue",
  },
  {
    title: "Docker Compose Postgres",
    meta: "DevOps - Updated 1d ago",
    icon: "SquareTerminal",
    tone: "purple",
  },
];

export const compareData = {
  snippetTitle: "JWT Auth Middleware",
  fileName: "auth_middleware.js",
  baseVersion: "v1.2.0 (Stable)",
  compareVersion: "v1.3.0-rc1 (Latest)",
  removals: 3,
  additions: 5,
  left: [
    { no: 42, text: "const token = req.headers['x-access-token'];", type: "same" },
    { no: 43, text: "", type: "same" },
    { no: 44, text: "if (!token) {", type: "same" },
    {
      no: 45,
      text: "- return res.status(403).send({ auth: false, message: 'No token provided.' });",
      type: "remove",
    },
    { no: 46, text: "}", type: "same" },
    { no: 47, text: "", type: "same" },
    {
      no: 48,
      text: "- jwt.verify(token, config.secret, function(err, decoded) {",
      type: "remove",
    },
    { no: 49, text: "- if (err)", type: "remove" },
    {
      no: 50,
      text: "  return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });",
      type: "same",
    },
    { no: 51, text: "", type: "same" },
    { no: 52, text: "  req.userId = decoded.id;", type: "same" },
  ],
  right: [
    { no: 42, text: "const token = req.headers['x-access-token'];", type: "same" },
    { no: 43, text: "", type: "same" },
    { no: 44, text: "if (!token) {", type: "same" },
    { no: 45, text: "+ logger.warn('Attempted access without token');", type: "add" },
    {
      no: 46,
      text: "+ return res.status(401).json({ error: 'Unauthorized access.' });",
      type: "add",
    },
    { no: 47, text: "}", type: "same" },
    { no: 48, text: "", type: "same" },
    { no: 49, text: "+ try {", type: "add" },
    {
      no: 50,
      text: "+ const decoded = await jwt.verify(token, process.env.JWT_SECRET);",
      type: "add",
    },
    { no: 51, text: "+ } catch (err) {", type: "add" },
    {
      no: 52,
      text: "  return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });",
      type: "same",
    },
    { no: 53, text: "", type: "same" },
    { no: 54, text: "  req.userId = decoded.id;", type: "same" },
  ],
};

export const landingCode = `import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  // Automatically versioned by Snit CLI
  // Last updated: 2 mins ago (v1.2.4)
};`;
