const db = require("../db/dbConfig.js");

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

module.exports = { getAllPosts, createPost };
