const db = require("../db/dbConfig.js");

const getAllComments = async (postId) => {
  try {
    const comments = await db.any(
      `SELECT comments.*, 
      (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS commented_by 
      FROM comments 
      LEFT JOIN users ON comments.user_id = users.id 
      WHERE comments.post_id = $1 
      ORDER BY comments.id DESC`,
      [postId]
    );
    return comments;
  } catch (error) {
    return error;
  }
};

const createComment = async (postId, body) => {
  try {
    const { user_id, comment_text } = body;
    const comment = await db.one(
      `INSERT INTO comments 
      (user_id, post_id, comment_text) 
      VALUES ($1, $2, $3) RETURNING *`,
      [user_id, postId, comment_text]
    );
    return {
      ...comment,
      ...(await db.one(
        `SELECT (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS commented_by 
        FROM users WHERE users.id = $1`,
        [user_id]
      )),
    };
  } catch (error) {
    throw new Error(`Error creating comment: ${error}`);
  }
}

const editComment = async (commentId, body) => {
  try {
    const { comment_text } = body;
    const comment = await db.one(
      `UPDATE comments 
      SET comment_text = $1 
      WHERE id = $2 RETURNING *`,
      [comment_text, commentId]
    );
    return comment;
  } catch (error) {
    throw new Error(`Error updating comment: ${error}`);
  }
}

const deleteComment = async (commentId) => {
  try {
    const comment = await db.one(
      `DELETE FROM comments 
      WHERE id = $1 RETURNING *`,
      [commentId]
    );
    return comment;
  } catch (error) {
    throw new Error(`Error deleting comment: ${error}`);
  }
}

const increaseLikes = async (commentId) => {
  try {
    const comment = await db.one(
      `UPDATE comments 
      SET likes = likes + 1 
      WHERE id = $1 RETURNING *`,
      [commentId]
    );
    return comment;
  } catch (error) {
    throw new Error(`Error increasing likes: ${error}`);
  }
}

const decreaseLikes = async (commentId) => {
  try {
    const comment = await db.one(
      `UPDATE comments 
      SET likes = likes - 1 
      WHERE id = $1 RETURNING *`,
      [commentId]
    );
    return comment;
  } catch (error) {
    throw new Error(`Error decreasing likes: ${error}`);
  }
}

module.exports = { getAllComments, createComment, editComment, deleteComment, increaseLikes, decreaseLikes};
