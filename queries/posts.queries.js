const db = require("../db/dbConfig.js");
const {
  addToS3,
  deleteFromS3,
  getSignedUrlFromS3,
} = require("../helper_functions/posts.hf.js");

const getAllPosts = async () => {
  try {
    const posts = await db.any(
      `SELECT posts.*, 
      (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS created_by, 
      COALESCE(json_agg (json_build_object('id', post_media.id, 'media_name', post_media.media_name, 'media_url', post_media.media_url, 'media_type', post_media.media_type)) 
      FILTER (WHERE post_media.id IS NOT NULL), '[]') AS post_media 
      FROM posts 
      LEFT JOIN post_media ON posts.id = post_media.post_id 
      LEFT JOIN users ON posts.user_id = users.id 
      GROUP BY posts.id, users.first_name, users.middle_name, users.last_name 
      ORDER BY posts.id DESC`
    );
    const postsWithMedia = await Promise.all(
      posts.map(async (post) => {
        if (post.post_media && post.post_media.length > 0) {
          post.post_media = await Promise.all(
            post.post_media.map(async (med) => {
              const signedUrl = await getSignedUrlFromS3(med.media_name);
              return {
                ...med,
                media_url: signedUrl,
              };
            })
          );
        }
        return post;
      })
    );
    return postsWithMedia;
  } catch (error) {
    return error;
  }
};

const getAllUserPosts = async (userId) => {
  try {
    const posts = await db.any(
      `SELECT posts.*, 
      (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS created_by, 
      COALESCE(json_agg (json_build_object('id', post_media.id, 'media_name', post_media.media_name, 'media_url', post_media.media_url,'media_type', post_media.media_type)) 
      FILTER (WHERE post_media.id IS NOT NULL), '[]') AS post_media 
      FROM posts 
      LEFT JOIN post_media ON posts.id = post_media.post_id 
      LEFT JOIN users ON posts.user_id = users.id 
      WHERE users.id = $1 
      GROUP BY posts.id, users.first_name, users.middle_name, users.last_name 
      ORDER BY posts.id DESC`,
      [userId]
    );
    const postsWithMedia = await Promise.all(
      posts.map(async (post) => {
        if (post.post_media && post.post_media.length > 0) {
          post.post_media = await Promise.all(
            post.post_media.map(async (med) => {
              const signedUrl = await getSignedUrlFromS3(med.media_name);
              return {
                ...med,
                media_url: signedUrl,
              };
            })
          );
        }
        return post;
      })
    );
    return postsWithMedia;
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
        const mediaType = med.mimetype;
        const mediaName = await addToS3(med);
        const mediaInfo = await db.one(
          `INSERT INTO post_media 
          (post_id, user_id, media_name, media_type) 
          VALUES ($1, $2, $3, $4) RETURNING *`,
          [post.id, user_id, mediaName, mediaType]
        );
        const signedUrl = await getSignedUrlFromS3(mediaName);
        return { ...mediaInfo, media_url: signedUrl };
      });
      mediaResults = await Promise.all(mediaQueries);
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
    const { post_text, post_location, remove_selected_media, user_id } = body;
    const post = await db.one(
      `UPDATE posts 
      SET post_text = $1, post_location = $2 
      WHERE id = $3 RETURNING *`,
      [post_text, post_location, postId]
    );
    if (remove_selected_media && remove_selected_media.length > 0) {
      await Promise.all(
        remove_selected_media.map(async (mediaName) => {
          await db.none(`DELETE FROM post_media WHERE media_name = $1`, [
            mediaName,
          ]);
          await deleteFromS3(mediaName);
        })
      );
    }
    if (media && media.length > 0) {
      await Promise.all(
        media.map(async (med) => {
          const mediaType = med.mimetype;
          const mediaName = await addToS3(med);
          return await db.one(
            `INSERT INTO post_media 
          (post_id, user_id, media_name, media_type) 
          VALUES ($1, $2, $3, $4) RETURNING *`,
            [post.id, user_id, mediaName, mediaType]
          );
        })
      );
    }
    const updatedPost = await db.one(
      `SELECT posts.*, 
      (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS created_by, 
      COALESCE(json_agg (json_build_object('id', post_media.id, 'media_name', post_media.media_name, 'media_url', post_media.media_url, 'media_type', post_media.media_type)) 
      FILTER (WHERE post_media.id IS NOT NULL), '[]') AS post_media 
      FROM posts 
      LEFT JOIN post_media ON posts.id = post_media.post_id 
      LEFT JOIN users ON posts.user_id = users.id 
      WHERE posts.id = $1 
      GROUP BY posts.id, users.first_name, users.middle_name, users.last_name`,
      [postId]
    );
    if (updatedPost.post_media && updatedPost.post_media.length > 0) {
      updatedPost.post_media = await Promise.all(
        updatedPost.post_media.map(async (med) => {
          const signedUrl = await getSignedUrlFromS3(med.media_name);
          return {
            ...med,
            media_url: signedUrl,
          };
        })
      );
    }
    return updatedPost;
  } catch (error) {
    throw new Error(`Error editing post: ${error}`);
  }
};

const deletePost = async (postId) => {
  try {
    const media = await db.any(`SELECT * FROM post_media WHERE post_id = $1`, [
      postId,
    ]);
    if (media && media.length > 0) {
      await Promise.all(
        media.map(async (med) => {
          await deleteFromS3(med.media_name);
        })
      );
    }
    const post = await db.one(`DELETE FROM posts WHERE id = $1 RETURNING *`, [
      postId,
    ]);
    return post;
  } catch (error) {
    return error;
  }
};

const increaseLikes = async (postId) => {
  try {
    const post = await db.one(
      `UPDATE posts 
      SET post_likes = post_likes + 1 
      WHERE id = $1 RETURNING *`,
      [postId]
    );
    const updatedPost = await db.one(
      `SELECT posts.*, 
      (users.first_name || ' ' || COALESCE(users.middle_name || ' ', '') || users.last_name) AS created_by, 
      COALESCE(json_agg (json_build_object('id', post_media.id, 'media_name', post_media.media_name, 'media_url', post_media.media_url, 'media_type', post_media.media_type)) 
      FILTER (WHERE post_media.id IS NOT NULL), '[]') AS post_media 
      FROM posts 
      LEFT JOIN post_media ON posts.id = post_media.post_id 
      LEFT JOIN users ON posts.user_id = users.id 
      WHERE posts.id = $1 
      GROUP BY posts.id, users.first_name, users.middle_name, users.last_name`,
      [postId]
    );
    if (updatedPost.post_media && updatedPost.post_media.length > 0) {
      updatedPost.post_media = await Promise.all(
        updatedPost.post_media.map(async (med) => {
          const signedUrl = await getSignedUrlFromS3(med.media_name);
          return {
            ...med,
            media_url: signedUrl,
          };
        })
      );
    }
    return updatedPost;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllPosts,
  getAllUserPosts,
  createPost,
  editPost,
  deletePost,
  increaseLikes,
};
