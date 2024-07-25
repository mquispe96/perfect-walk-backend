DROP DATABASE IF EXISTS perfect_walk_db;

CREATE DATABASE perfect_walk_db;

\c perfect_walk_db;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  birthdate DATE NOT NULL,
  location_city TEXT,
  location_state TEXT,
  location_zip INTEGER,
  security_question TEXT NOT NULL,
  security_answer TEXT NOT NULL,
  member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  post_text TEXT,
  post_likes INTEGER DEFAULT 0,
  post_location TEXT,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Research multer for file upload (Chatgpt example)
CREATE TABLE post_media (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  media BYTEA,
  media_type VARCHAR(50), 
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  post_id INTEGER REFERENCES posts(id),
  comment_text TEXT NOT NULL,
  comment_likes INTEGER DEFAULT 0,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sub_comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  comment_id INTEGER REFERENCES comments(id),
  sub_comment_text TEXT NOT NULL,
  sub_comment_likes INTEGER DEFAULT 0,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
