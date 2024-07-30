const express = require("express");
const posts = express.Router();
const { getAllPosts, createPost } = require("../queries/posts.queries.js");

posts.get("/", async (req, res) => {
  const allPosts = await getAllPosts();
  res.json(allPosts);
});

posts.post("/", async (req, res) => {
  try {
    const newPost = await createPost(req.body, req.files);
    res.json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating post. Please try again." });
  }
});

module.exports = posts;
