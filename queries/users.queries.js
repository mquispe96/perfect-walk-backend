const db = require("../db/dbConfig.js");

const getSecurityQuestion = async (email) => {
  try {
    const user = await db.one(
      "SELECT security_question FROM users WHERE email = $1",
      [email]
    );
    return user;
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
    return user.security_answer === answer;
  } catch (error) {
    return error;
  }
};

const resetPassword = async (email, newPassword) => {
  try {
    const user = await db.one(
      "UPDATE users SET password = $1 WHERE email = $2 RETURNING id",
      [newPassword, email]
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
    const newUser = await db.one(
      "INSERT INTO users (email, username, password, first_name, middle_name, last_name, birth_date, location_city, location_state, location_zip, security_question, security_answer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id, username, first_name, middle_name, last_name, birth_date, location_city, location_state, location_zip, member_since",
      [
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
      ]
    );
    return newUser;
  } catch (error) {
    return error;
  }
};

const userLogin = async (username, password) => {
  try {
    const user = await db.one(
      "SELECT id, username, first_name, middle_name, last_name, birth_date, location_city, location_state, location_zip, member_since FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    return user;
  } catch (error) {
    return error;
  }
};

const changePassword = async (email, password, newPassword) => {
  try {
    const user = await db.one(
      "UPDATE users SET password = $1 WHERE email = $2 AND password = $3 RETURNING id",
      [newPassword, email, password]
    );
    return user;
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
