const db = require("../db/dbConfig.js");
const bcrypt = require("bcrypt");

const itsNewUser = async (req, res, next) => {
  const { email, username } = req.body;
  const newEmail = await db.oneOrNone(
    "SELECT email FROM users WHERE email = $1",
    [email]
  );
  const newUsername = await db.oneOrNone(
    "SELECT username FROM users WHERE username = $1",
    [username]
  );
  if (newEmail) {
    res.status(400).json({ error: "Email already exists" });
  } else if (newUsername) {
    res.status(400).json({ error: "Username already exists" });
  } else {
    next();
  }
};

const validateEmail = async (req, res, next) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const { email } = req.body;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Invalid email format" });
  } else {
    next();
  }
};

const hasRequiredFields = async (req, res, next) => {
  const requiredFields = [
    "email",
    "username",
    "password",
    "firstName",
    "lastName",
    "birthDate",
    "securityQuestion",
    "securityAnswer",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length) {
    res.status(400).json(missingFields);
  } else {
    next();
  }
};

const confirmUserBeforeDeletion = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      next();
    } else {
      res.status(400).json({ error: "Invalid password" });
    }
  } else {
    res.status(400).json({ error: "Invalid email" });
  }
};

module.exports = {
  itsNewUser,
  validateEmail,
  hasRequiredFields,
  confirmUserBeforeDeletion,
};
