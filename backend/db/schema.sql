-- MySQL DDL: auto-increment primary keys, InnoDB, utf8mb4
-- Drop child tables first to avoid FK errors (safe to run repeatedly)
-- create database finwise;
-- use finwise;
DROP TABLE IF EXISTS approvals;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS dashboard_stats;
DROP TABLE IF EXISTS revoked_tokens;
DROP TABLE IF EXISTS volunteers;
DROP TABLE IF EXISTS employees;

-- Volunteers (authors / volunteer accounts)
CREATE TABLE volunteers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  is_approved TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employees (admins / staff)
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(100),
  phone VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Courses
CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(400) NOT NULL,
  course_description LONGTEXT,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  thumbnail_url VARCHAR(1000),
  video_url VARCHAR(1000),               -- URL to course video (nullable)
  content LONGTEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blogs (author references volunteers)
CREATE TABLE blogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(400) NOT NULL,
  slug VARCHAR(400) NOT NULL UNIQUE,
  content LONGTEXT,
  image_url VARCHAR(1000),         -- URL to blog image (nullable)
  image_alt VARCHAR(255),          -- alt text for accessibility
  image_caption VARCHAR(500),      -- optional caption/credit
  author_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (author_id),
  CONSTRAINT fk_blogs_author FOREIGN KEY (author_id) REFERENCES volunteers(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Approvals (volunteer approvals, admin who approved/rejected)
CREATE TABLE approvals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  volunteer_id INT NOT NULL,
  admin_id INT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  comment LONGTEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (volunteer_id),
  INDEX (admin_id),
  CONSTRAINT fk_approvals_volunteer FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_approvals_admin FOREIGN KEY (admin_id) REFERENCES employees(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dashboard stats (simple key-value)
CREATE TABLE dashboard_stats (
  stat_key VARCHAR(200) PRIMARY KEY,
  stat_value LONGTEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quizzes (store JSON using JSON type)
CREATE TABLE quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(400),
  data JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Revoked tokens (JWT jti store)
CREATE TABLE revoked_tokens (
  jti VARCHAR(255) PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Useful indexes
CREATE INDEX idx_courses_title ON courses(title);
CREATE INDEX idx_approvals_volunteer ON approvals(volunteer_id);

-- Final commit not necessary in MySQL CLI, but included for clarity in transactional contexts
COMMIT;
select * from approvals;

show databases;
select * from volunteers;
-- === (Optional) Plaintext demo inserts — DO NOT USE IN PRODUCTION ===
-- INSERT INTO employees (email, password, name, role, phone)
-- VALUES ('admin@example.com',  'AdminPass!23', 'Site Admin', 'admin', '+91-9000000001');
-- (repeat for other rows as needed)
use finwise;
show tables;
insert into volunteers (email, password, name, phone, is_approved)
values ('iit2023237@iiita.ac.in', SHA2('ava', 256), 'student', '4564324653', 1);

