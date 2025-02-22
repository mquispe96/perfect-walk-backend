const express = require("express");
const humps = require("humps");
const comments = express.Router({ mergeParams: true });
const subCommentsController = require("./subcomments.controller.js");
const {
  getAllComments,
  createComment,
  editComment,
  deleteComment,
  increaseLikes,
} = require("../queries/comments.queries.js");

comments.use("/:commentId/subcomments", subCommentsController);

comments.get("/", async (req, res) => {
  const { postId } = req.params;
  const allComments = await getAllComments(postId);
  res.json(humps.camelizeKeys(allComments));
});

comments.post("/", async (req, res) => {
  try {
    const { postId } = req.params;
    const newComment = await createComment(
      postId,
      humps.decamelizeKeys(req.body)
    );
    res.json(humps.camelizeKeys(newComment));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error creating comment. Please try again." });
  }
});

comments.put("/:commentId/like", async (req, res) => {
  try {
    const { commentId } = req.params;
    const updatedComment = await increaseLikes(commentId);
    res.json(humps.camelizeKeys(updatedComment));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error increasing likes. Please try again." });
  }
});

comments.put("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const updatedComment = await editComment(
      commentId,
      humps.decamelizeKeys(req.body)
    );
    res.json(humps.camelizeKeys(updatedComment));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error updating comment. Please try again." });
  }
});

comments.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    await deleteComment(commentId);
    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error deleting comment. Please try again." });
  }
});

module.exports = comments;
