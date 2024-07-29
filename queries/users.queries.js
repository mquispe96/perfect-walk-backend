const db = require("../db/dbConfig.js");
const bcrypt = require("bcrypt");

const getSecurityQuestion = async (email) => {
  try {
    const question = await db.oneOrNone(
      "SELECT security_question FROM users WHERE email = $1",
      [email]
    );
    return question;
  } catch (error) {
    return error;
  }
};

const checkSecurityAnswer = async (email, answer) => {
  try {
    const user = await db.one(
      "SELECT security_answer FROM users WHERE email = $1",
      [email]
    );
    const isMatch = await bcrypt.compare(answer, user.security_answer);
    return isMatch;
  } catch (error) {
    return error;
  }
};

const resetPassword = async (email, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await db.one(
      "UPDATE users SET password = $1 WHERE email = $2 RETURNING id",
      [hashedPassword, email]
    );
    return user;
  } catch (error) {
    return error;
  }
};

const userRegistration = async (info) => {
  try {
    const {
      email,
      username,
      password,
      first_name,
      middle_name,
      last_name,
      birth_date,
      location_city,
      location_state,
      location_zip,
      security_question,
      security_answer,
    } = info;
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(security_answer, 10);
    const newUser = await db.one(
      "INSERT INTO users (email, username, password, first_name, middle_name, last_name, birth_date, location_city, location_state, location_zip, security_question, security_answer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id, username, first_name, middle_name, last_name, birth_date, location_city, location_state, location_zip, member_since",
      [
        email,
        username,
        hashedPassword,
        first_name,
        middle_name,
        last_name,
        birth_date,
        location_city,
        location_state,
        location_zip,
        security_question,
        hashedAnswer,
      ]
    );
    return newUser;
  } catch (error) {
    return error;
  }
};

const userLogin = async (username, password) => {
  try {
    const user = await db.oneOrNone(
      "SELECT id, username, first_name, middle_name, last_name, birth_date, location_city, location_state, location_zip, member_since FROM users WHERE username = $1",
      [username]
    );
    if (!user) {
      return { error: "User not found" };
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      } else {
        return { error: "Incorrect password" };
      }
    }
  } catch (error) {
    return error;
  }
};

const changePassword = async (email, password, newPassword) => {
  try {
    const user = await db.oneOrNone(
      "SELECT password FROM users WHERE email = $1",
      [email]
    );
    if (!user) {
      return { error: "User not found" };
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await db.one(
          "UPDATE users SET password = $1 WHERE email = $2 RETURNING id",
          [hashedPassword, email]
        );
        return updatedUser;
      } else {
        return { error: "Incorrect password" };
      }
    }
  } catch (error) {
    return error;
  }
};

const deleteAccount = async (id) => {
  try {
    const user = await db.one("DELETE FROM users WHERE id = $1 RETURNING id", [
      id,
    ]);
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getSecurityQuestion,
  checkSecurityAnswer,
  resetPassword,
  userRegistration,
  userLogin,
  changePassword,
  deleteAccount,
};
