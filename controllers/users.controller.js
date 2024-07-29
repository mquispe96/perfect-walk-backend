const express = require("express");
const humps = require("humps");
const users = express.Router();
const {
  getSecurityQuestion,
  checkSecurityAnswer,
  resetPassword,
  userRegistration,
  userLogin,
  changePassword,
  deleteAccount,
} = require("../queries/users.queries.js");
const {
  itsNewUser,
  validateEmail,
  hasRequiredFields,
  confirmUserBeforeDeletion,
} = require("../validations/users.validations.js");
const { formatRegistrationData } = require("../formatting/users.format.js");

users.get("/", async (req, res) =>
  res.status(403).json({ error: "Access denied" })
);

users.get("/get-security-question/:email", async (req, res) => {
  const { email } = req.params;
  const question = await getSecurityQuestion(email);
  if (question) {
    res.json({ question });
  } else {
    res.status(404).json({
      error: "No Security Question found with provided email, try agin",
    });
  }
});

users.post("/check-security-answer", async (req, res) => {
  const { email, answer } = req.body;
  const confirmed = await checkSecurityAnswer(email, answer);
  if (confirmed) {
    res.json({ confirmed });
  } else {
    res.status(400).json({ error: "Incorrect answer" });
  }
});

users.put("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await resetPassword(email, newPassword);
  if (user.id) {
    res.json({ message: "Password reset successfully" });
  } else {
    res.status(400).json({ error: "Password reset failed" });
  }
});

users.post(
  "/register",
  validateEmail,
  itsNewUser,
  hasRequiredFields,
  async (req, res) => {
    const formattedData = formatRegistrationData(req.body);
    const newUser = await userRegistration(humps.decamelizeKeys(formattedData));
    if (newUser.id) {
      res.json(humps.camelizeKeys(newUser));
    } else {
      res.status(400).json({ error: "Registration failed" });
    }
  }
);

users.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userLogin(username, password);
  if (user.id) {
    res.json(humps.camelizeKeys(user));
  } else {
    res.status(400).json(user.error);
  }
});

users.put("/change-password", async (req, res) => {
  const { email, password, newPassword } = req.body;
  const user = await changePassword(email, password, newPassword);
  if (user.id) {
    res.json({ message: "Password changed successfully" });
  } else {
    res.status(400).json(user.error);
  }
});

users.delete(
  "/delete-account/:id",
  confirmUserBeforeDeletion,
  async (req, res) => {
    const { id } = req.params;
    const user = await deleteAccount(id);
    if (user.id) {
      res.json({ message: "Account deleted successfully" });
    } else {
      res.status(400).json({ error: "Account deletion failed" });
    }
  }
);

module.exports = users;
