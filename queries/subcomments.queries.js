const db = require("../db/dbConfig.js");

const getAllSubComments = async (commentId) => {
  try {
    const subComments = await db.any(
      `SELECT sub_comments.*, 
      (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS commented_by 
      FROM sub_comments 
      LEFT JOIN users ON sub_comments.user_id = users.id 
      WHERE sub_comments.comment_id = $1 
      ORDER BY sub_comments.id DESC`,
      [commentId]
    );
    return subComments;
  } catch (error) {
    return error;
  }
};

const createSubComment = async (commentId, body) => {
  try {
    const { user_id, sub_comment_text } = body;
    const subComment = await db.one(
      `INSERT INTO sub_comments 
      (user_id, comment_id, sub_comment_text) 
      VALUES ($1, $2, $3) RETURNING *`,
      [user_id, commentId, sub_comment_text]
    );
    return {
      ...subComment,
      ...(await db.one(
        `SELECT (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS commented_by 
        FROM users WHERE users.id = $1`,
        [user_id]
      )),
    };
  } catch (error) {
    throw new Error(`Error creating subcomment: ${error}`);
  }
};

const editSubComment = async (subCommentId, body) => {
  try {
    const { sub_comment_text } = body;
    const subComment = await db.one(
      `UPDATE sub_comments 
      SET sub_comment_text = $1 
      WHERE id = $2 RETURNING *`,
      [sub_comment_text, subCommentId]
    );
    return subComment;
  } catch (error) {
    throw new Error(`Error updating subcomment: ${error}`);
  }
};

const deleteSubComment = async (subCommentId) => {
  try {
    const subComment = await db.one(
      `DELETE FROM sub_comments 
      WHERE id = $1 RETURNING *`,
      [subCommentId]
    );
    return subComment;
  } catch (error) {
    throw new Error(`Error deleting subcomment: ${error}`);
  }
};

const increaseLikes = async (subCommentId) => {
  try {
    const subComment = await db.one(
      `UPDATE sub_comments 
      SET likes = likes + 1 
      WHERE id = $1 RETURNING *`,
      [subCommentId]
    );
    return subComment;
  } catch (error) {
    throw new Error(`Error increasing likes: ${error}`);
  }
};

const decreaseLikes = async (subCommentId) => {
  try {
    const subComment = await db.one(
      `UPDATE sub_comments 
      SET likes = likes - 1 
      WHERE id = $1 RETURNING *`,
      [subCommentId]
    );
    return subComment;
  } catch (error) {
    throw new Error(`Error decreasing likes: ${error}`);
  }
};

module.exports = {
  getAllSubComments,
  createSubComment,
  editSubComment,
  deleteSubComment,
  increaseLikes,
  decreaseLikes,
};
