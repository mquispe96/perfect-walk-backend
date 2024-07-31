const db = require("../db/dbConfig.js");
const {deleteFromS3} = require('../helper_functions/posts.hf.js');

const getAllPosts = async () => {
  try {
    const posts = await db.any(
      `SELECT posts.*, 
      (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS created_by, 
      COALESCE(json_agg (json_build_object('id', post_media.id, 'media', post_media.media, 'media_type', post_media.media_type)) 
      FILTER (WHERE post_media.id IS NOT NULL), '[]') AS post_media 
      FROM posts 
      LEFT JOIN post_media ON posts.id = post_media.post_id 
      LEFT JOIN users ON posts.user_id = users.id 
      GROUP BY posts.id, users.first_name, users.middle_name, users.last_name 
      ORDER BY posts.id DESC`
    );
    return posts;
  } catch (error) {
    return error;
  }
};

const getAllUserPosts = async (userId) => {
  try {
    const posts = await db.any(
      `SELECT posts.*, 
      (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS created_by, 
      COALESCE(json_agg (json_build_object('id', post_media.id, 'media', post_media.media, 'media_type', post_media.media_type)) 
      FILTER (WHERE post_media.id IS NOT NULL), '[]') AS post_media 
      FROM posts 
      LEFT JOIN post_media ON posts.id = post_media.post_id 
      LEFT JOIN users ON posts.user_id = users.id 
      WHERE users.id = $1 
      GROUP BY posts.id, users.first_name, users.middle_name, users.last_name 
      ORDER BY posts.id DESC`,
      [userId]
    );
    return posts;
  } catch (error) {
    return error;
  }
};

const createPost = async (body, media) => {
  try {
    const { user_id, post_text, post_location } = body;
    const post = await db.one(
      `INSERT INTO posts 
      (user_id, post_text, post_location) 
      VALUES ($1, $2, $3) RETURNING *`,
      [user_id, post_text, post_location]
    );
    let mediaResults = [];
    if (media && media.length > 0) {
      const mediaQueries = media.map(async (med) => {
        const mediaUrl = med.location;
        const mediaType = med.mimetype;
        return await db.one(
          `INSERT INTO post_media 
          (post_id, media_url, media_type) 
          VALUES ($1, $2, $3) RETURNING *`,
          [post.id, mediaUrl, mediaType]
        );
      });
      mediaResults = await db.batch(mediaQueries);
    }
    return {
      ...post,
      ...(await db.one(
        `SELECT (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS created_by 
        FROM users WHERE users.id = $1`,
        [user_id]
      )),
      post_media: mediaResults,
    };
  } catch (error) {
    throw new Error(`Error creating post: ${error}`);
  }
};

const editPost = async (postId, body, media) => {
  try {
    const { post_text, post_location, remove_selected_media } = body;
    const post = await db.one(
      `UPDATE posts 
      SET post_text = $1, post_location = $2 
      WHERE id = $3 RETURNING *`,
      [post_text, post_location, postId]
    );
    remove_selected_media.forEach(async (mediaUrl) => {
      const key = mediaUrl.split("/").pop();
      await db.one(`DELETE FROM post_media WHERE media_url = $1`, [mediaUrl]);
      await deleteFromS3(key);
    });
    let mediaResults = [];
    if (media && media.length > 0) {
      const mediaQueries = media.map(async (med) => {
        const mediaUrl = med.location;
        const mediaType = med.mimetype;
        return await db.one(
          `INSERT INTO post_media 
          (post_id, media_url, media_type) 
          VALUES ($1, $2, $3) RETURNING *`,
          [post.id, mediaUrl, mediaType]
        );
      });
      mediaResults = await db.batch(mediaQueries);
    }
    return {
      ...post,
      post_media: mediaResults,
    };
  } catch (error) {
    throw new Error(`Error editing post: ${error}`);
  }
};

const deletePost = async (postId) => {
  try {
    const media = await db.any(
      `SELECT media_url FROM post_media WHERE post_id = $1`,
      [postId]
    );
    media.forEach(async (med) => {
      const key = med.media_url.split("/").pop();
      await deleteFromS3(key);
    });
    const post = await db.one(
      `DELETE FROM posts WHERE id = $1 RETURNING *`,
      [postId]
    );
    return post;
  } catch (error) {
    return error;
  }
};

const increaseLikes = async (postId) => {
  try {
    const post = await db.one(
      `UPDATE posts 
      SET likes = likes + 1 
      WHERE id = $1 RETURNING *`,
      [postId]
    );
    return post;
  } catch (error) {
    return error;
  }
};

const decreaseLikes = async (postId) => {
  try {
    const post = await db.one(
      `UPDATE posts 
      SET likes = likes - 1 
      WHERE id = $1 RETURNING *`,
      [postId]
    );
    return post;
  } catch (error) {
    return error;
  }
};

module.exports = { getAllPosts, getAllUserPosts, createPost, editPost, deletePost, increaseLikes, decreaseLikes};
