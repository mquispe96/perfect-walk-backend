const express = require("express");
const humps = require("humps");
const posts = express.Router();
const commentsController = require("./comments.controller.js");
const {
  getAllPosts,
  getAllUserPosts,
  createPost,
  editPost,
  deletePost,
  increaseLikes,
  decreaseLikes,
} = require("../queries/posts.queries.js");

posts.use("/:postId/comments", commentsController);

posts.get("/", async (req, res) => {
  const allPosts = await getAllPosts();
  res.json(humps.camelizeKeys(allPosts));
});

posts.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userPosts = await getAllUserPosts(userId);
  res.json(humps.camelizeKeys(userPosts));
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

posts.put('/:postID/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedPost = await increaseLikes(postId);
    res.json(humps.camelizeKeys(updatedPost));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error increasing likes. Please try again." });
  }
});

posts.put('/:postID/dislike', async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedPost = await decreaseLikes(postId);
    res.json(humps.camelizeKeys(updatedPost));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error decreasing likes. Please try again." });
  }
});

posts.put('/:postID', async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedPost = await editPost(postId, humps.decamelizeKeys(req.body), req.files);
    res.json(humps.camelizeKeys(updatedPost));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error editing post. Please try again." });
  }
});

posts.delete('/:postID', async (req, res) => {
  try {
    const { postId } = req.params;
    await deletePost(postId);
    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting post. Please try again." });
  }
});

module.exports = posts;
