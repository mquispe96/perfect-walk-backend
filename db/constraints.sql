\c perfect_walk_db;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_user_id_fkey') THEN
    ALTER TABLE posts DROP CONSTRAINT posts_user_id_fkey;
  END IF;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE posts
ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id)
REFERENCES users (id) ON DELETE CASCADE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_media_post_id_fkey') THEN
    ALTER TABLE post_media DROP CONSTRAINT post_media_post_id_fkey;
  END IF;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE post_media
ADD CONSTRAINT post_media_post_id_fkey FOREIGN KEY (post_id)
REFERENCES posts (id) ON DELETE CASCADE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'comments_user_id_fkey') THEN
    ALTER TABLE comments DROP CONSTRAINT comments_user_id_fkey;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'comments_post_id_fkey') THEN
    ALTER TABLE comments DROP CONSTRAINT comments_post_id_fkey;
  END IF;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE comments
ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id)
REFERENCES users (id) ON DELETE CASCADE,
ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id)
REFERENCES posts (id) ON DELETE CASCADE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sub_comments_user_id_fkey') THEN
    ALTER TABLE sub_comments DROP CONSTRAINT sub_comments_user_id_fkey;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sub_comments_comment_id_fkey') THEN
    ALTER TABLE sub_comments DROP CONSTRAINT sub_comments_comment_id_fkey;
  END IF;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE sub_comments
ADD CONSTRAINT sub_comments_user_id_fkey FOREIGN KEY (user_id)
REFERENCES users (id) ON DELETE CASCADE,
ADD CONSTRAINT sub_comments_comment_id_fkey FOREIGN KEY (comment_id)
REFERENCES comments (id) ON DELETE CASCADE;
