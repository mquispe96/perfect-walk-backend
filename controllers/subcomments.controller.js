const express = require("express");
const humps = require("humps");
const subComments = express.Router({ mergeParams: true });
const {
  getAllSubComments,
  createSubComment,
  editSubComment,
  deleteSubComment,
  increaseLikes,
  decreaseLikes,
} = require("../queries/subcomments.queries.js");

subComments.get("/", async (req, res) => {
  const { commentId } = req.params;
  const allSubComments = await getAllSubComments(commentId);
  res.json(humps.camelizeKeys(allSubComments));
});

subComments.post("/", async (req, res) => {
  try {
    const { commentId } = req.params;
    const newSubComment = await createSubComment(
      commentId,
      humps.decamelizeKeys(req.body)
    );
    res.json(humps.camelizeKeys(newSubComment));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error creating subcomment. Please try again." });
  }
});

subComments.put("/:subCommentId", async (req, res) => {
  try {
    const { subCommentId } = req.params;
    const updatedSubComment = await editSubComment(
      subCommentId,
      humps.decamelizeKeys(req.body)
    );
    res.json(humps.camelizeKeys(updatedSubComment));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error updating subcomment. Please try again." });
  }
});

subComments.put("/:subCommentId/like", async (req, res) => {
  try {
    const { subCommentId } = req.params;
    const updatedSubComment = await increaseLikes(subCommentId);
    res.json(humps.camelizeKeys(updatedSubComment));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error increasing likes. Please try again." });
  }
});

subComments.put("/:subCommentId/dislike", async (req, res) => {
  try {
    const { subCommentId } = req.params;
    const updatedSubComment = await decreaseLikes(subCommentId);
    res.json(humps.camelizeKeys(updatedSubComment));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error decreasing likes. Please try again." });
  }
});

subComments.delete("/:subCommentId", async (req, res) => {
  try {
    const { subCommentId } = req.params;
    const deletedSubComment = await deleteSubComment(subCommentId);
    res.json(humps.camelizeKeys(deletedSubComment));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error deleting subcomment. Please try again." });
  }
});

module.exports = subComments;
