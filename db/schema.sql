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
  birth_date DATE NOT NULL,
  location_city TEXT,
  location_state TEXT,
  location_zip TEXT,
  security_question TEXT NOT NULL,
  security_answer TEXT NOT NULL,
  member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_text TEXT,
  post_likes INTEGER DEFAULT 0,
  post_location TEXT,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_media (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  media_name TEXT NOT NULL,
  media_url TEXT,
  media_type VARCHAR(50), 
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  comment_likes INTEGER DEFAULT 0,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sub_comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  sub_comment_text TEXT NOT NULL,
  sub_comment_likes INTEGER DEFAULT 0,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
