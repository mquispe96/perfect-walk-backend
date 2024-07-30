\c perfect_walk_db;

INSERT INTO users
(email, username, password, first_name, middle_name, last_name, birth_Date, location_city, location_state, location_zip, security_question, security_answer) 
VALUES
('mquispe@pursuit.org', 'mquispe', 'Pursuit@2024', 'Marco', 'R', 'Quispe', '1996-07-03', 'West Hartford', 'CT', 06110, 'What is your favorite color?', 'Blue');

INSERT INTO posts
(user_id, post_text, post_likes, post_location)
VALUES
(1, 'Went for a hike this morning, it was amazing!', 2, 'New York, NY'),
(1, 'View was amazing!, too sad it started raining', 1, 'New York, NY'),
(1, 'I love the smell of fresh rain', 5, 'New York, NY'),
(1, 'Luca loved the park today', 3, 'Simsbury, CT'),
(1, 'The sunset was beautiful today', 4, 'Simsbury, CT'),
(1, 'Been here since 6am, the sunrise was amazing', 6, 'Simsbury, CT');

INSERT INTO comments
(user_id, post_id, comment_text, comment_likes)
VALUES
(1, 1, 'I love hiking!', 1),
(1, 1, 'I love hiking too!', 2),
(1, 2, 'I love the rain!', 1),
(1, 3, 'I love the smell of rain too!', 3),
(1, 4, 'I love the park!', 2),
(1, 5, 'I love sunsets!', 4),
(1, 6, 'I love sunrises!', 5);

INSERT INTO sub_comments
(user_id, comment_id, sub_comment_text, sub_comment_likes)
VALUES
(1, 1, 'Hiking is the best!', 1),
(1, 1, 'I agree!', 2),
(1, 2, 'Rain is the best!', 1),
(1, 3, 'Rain is the best!', 3),
(1, 4, 'Parks are the best!', 2),
(1, 5, 'Sunsets are the best!', 4),
(1, 6, 'Sunrises are the best!', 5);
