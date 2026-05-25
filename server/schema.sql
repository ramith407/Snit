-- Snit Database Schema

CREATE DATABASE IF NOT EXISTS snit_db;
USE snit_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'FREE',
  role VARCHAR(100) DEFAULT 'Developer',
  bio TEXT,
  avatar_url VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Snippets Table
CREATE TABLE IF NOT EXISTS snippets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  language VARCHAR(100) NOT NULL,
  language_short VARCHAR(10) NOT NULL,
  description TEXT,
  user_id INT NOT NULL,
  favorite BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  forks INT DEFAULT 0,
  code TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Snippet Tags Table
CREATE TABLE IF NOT EXISTS snippet_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  snippet_id INT NOT NULL,
  tag VARCHAR(100) NOT NULL,
  FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
  UNIQUE KEY unique_snippet_tag (snippet_id, tag)
);

-- 4. Versions Table
CREATE TABLE IF NOT EXISTS versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  snippet_id INT NOT NULL,
  label VARCHAR(50) NOT NULL,
  message VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  code TEXT NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
);

-- 5. Snippet Audit Logs Table
CREATE TABLE IF NOT EXISTS snippet_audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  snippet_id INT,
  user_id INT,
  action ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
  old_value JSON,
  new_value JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Views

CREATE OR REPLACE VIEW v_snippet_library AS
SELECT
  s.id AS snippet_id,
  s.slug,
  s.title,
  s.file_name,
  s.language,
  s.language_short,
  s.description,
  s.favorite,
  s.views,
  s.forks,
  s.code,
  s.created_at,
  s.updated_at,
  u.id AS user_id,
  u.name AS owner_name,
  u.handle AS owner_handle,
  COALESCE(tag_summary.tags, '') AS tags,
  COALESCE(version_summary.version_count, 0) AS version_count,
  version_summary.latest_version_at
FROM snippets s
JOIN users u ON u.id = s.user_id
LEFT JOIN (
  SELECT
    snippet_id,
    GROUP_CONCAT(DISTINCT tag ORDER BY tag SEPARATOR ',') AS tags
  FROM snippet_tags
  GROUP BY snippet_id
) tag_summary ON tag_summary.snippet_id = s.id
LEFT JOIN (
  SELECT
    snippet_id,
    COUNT(*) AS version_count,
    MAX(created_at) AS latest_version_at
  FROM versions
  GROUP BY snippet_id
) version_summary ON version_summary.snippet_id = s.id;

CREATE OR REPLACE VIEW v_user_dashboard_stats AS
SELECT
  u.id AS user_id,
  u.name,
  u.handle,
  COALESCE(snippet_stats.total_snippets, 0) AS total_snippets,
  COALESCE(version_stats.total_versions, 0) AS total_versions,
  COALESCE(snippet_stats.favorite_snippets, 0) AS favorite_snippets,
  COALESCE(snippet_stats.total_views, 0) AS total_views,
  COALESCE(snippet_stats.total_forks, 0) AS total_forks,
  snippet_stats.last_snippet_update
FROM users u
LEFT JOIN (
  SELECT
    user_id,
    COUNT(*) AS total_snippets,
    SUM(CASE WHEN favorite = TRUE THEN 1 ELSE 0 END) AS favorite_snippets,
    SUM(views) AS total_views,
    SUM(forks) AS total_forks,
    MAX(updated_at) AS last_snippet_update
  FROM snippets
  GROUP BY user_id
) snippet_stats ON snippet_stats.user_id = u.id
LEFT JOIN (
  SELECT
    s.user_id,
    COUNT(v.id) AS total_versions
  FROM snippets s
  LEFT JOIN versions v ON v.snippet_id = s.id
  GROUP BY s.user_id
) version_stats ON version_stats.user_id = u.id;

CREATE OR REPLACE VIEW v_version_history AS
SELECT
  v.id AS version_id,
  v.snippet_id,
  s.slug,
  s.title AS snippet_title,
  s.file_name,
  v.label,
  v.message,
  v.author,
  v.code,
  v.is_current,
  v.created_at
FROM versions v
JOIN snippets s ON s.id = v.snippet_id;

-- Triggers

DROP TRIGGER IF EXISTS trg_snippets_after_insert_audit;

CREATE TRIGGER trg_snippets_after_insert_audit
AFTER INSERT ON snippets
FOR EACH ROW
INSERT INTO snippet_audit_logs (snippet_id, user_id, action, old_value, new_value)
VALUES (
  NEW.id,
  NEW.user_id,
  'CREATE',
  NULL,
  JSON_OBJECT(
    'title', NEW.title,
    'description', NEW.description,
    'language', NEW.language,
    'favorite', NEW.favorite,
    'code', NEW.code
  )
);

DROP TRIGGER IF EXISTS trg_snippets_after_update_audit;

CREATE TRIGGER trg_snippets_after_update_audit
AFTER UPDATE ON snippets
FOR EACH ROW
INSERT INTO snippet_audit_logs (snippet_id, user_id, action, old_value, new_value)
SELECT
  NEW.id,
  NEW.user_id,
  'UPDATE',
  JSON_OBJECT(
    'title', OLD.title,
    'description', OLD.description,
    'language', OLD.language,
    'favorite', OLD.favorite,
    'code', OLD.code
  ),
  JSON_OBJECT(
    'title', NEW.title,
    'description', NEW.description,
    'language', NEW.language,
    'favorite', NEW.favorite,
    'code', NEW.code
  )
FROM DUAL
WHERE NOT (
  OLD.title <=> NEW.title
  AND OLD.description <=> NEW.description
  AND OLD.language <=> NEW.language
  AND OLD.favorite <=> NEW.favorite
  AND OLD.code <=> NEW.code
);

DROP TRIGGER IF EXISTS trg_snippets_after_delete_audit;

CREATE TRIGGER trg_snippets_after_delete_audit
AFTER DELETE ON snippets
FOR EACH ROW
INSERT INTO snippet_audit_logs (snippet_id, user_id, action, old_value, new_value)
VALUES (
  OLD.id,
  OLD.user_id,
  'DELETE',
  JSON_OBJECT(
    'title', OLD.title,
    'description', OLD.description,
    'language', OLD.language,
    'favorite', OLD.favorite,
    'code', OLD.code
  ),
  NULL
);

DROP TRIGGER IF EXISTS trg_versions_after_insert_touch_snippet;

CREATE TRIGGER trg_versions_after_insert_touch_snippet
AFTER INSERT ON versions
FOR EACH ROW
UPDATE snippets
SET updated_at = CURRENT_TIMESTAMP
WHERE id = NEW.snippet_id;
