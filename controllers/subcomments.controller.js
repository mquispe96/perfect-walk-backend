const express = require("express");
const humps = require("humps");
const subcomments = express.Router({ mergeParams: true });
const {
  getAllSubComments,
  createSubComment,
  editSubComment,
  deleteSubComment,
  increaseLikes,
} = require("../queries/subcomments.queries.js");

subcomments.get("/", async (req, res) => {
  const { commentId } = req.params;
  const allSubComments = await getAllSubComments(commentId);
  res.json(humps.camelizeKeys(allSubComments));
});

subcomments.post("/", async (req, res) => {
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

subcomments.put("/:subCommentId/like", async (req, res) => {
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

subcomments.put("/:subCommentId", async (req, res) => {
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

subcomments.delete("/:subCommentId", async (req, res) => {
  try {
    const { subCommentId } = req.params;
    await deleteSubComment(subCommentId);
    res.json({ message: "Subcomment deleted successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error deleting subcomment. Please try again." });
  }
});

module.exports = subcomments;
