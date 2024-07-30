const express = require("express");
const humps = require("humps");
const posts = express.Router();
const commentsController = require("./comments.controller.js");
const { getAllPosts, createPost } = require("../queries/posts.queries.js");

posts.use("/:postId/comments", commentsController);

posts.get("/", async (req, res) => {
  const allPosts = await getAllPosts();
  res.json(humps.camelizeKeys(allPosts));
});

posts.post("/", async (req, res) => {
  try {
    const newPost = await createPost(humps.decamelizeKeys(req.body), req.files);
    res.json(humps.camelizeKeys(newPost));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating post. Please try again." });
  }
});

module.exports = posts;
