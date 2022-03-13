const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Users = require("../models/Users");
const { isAuthenticated } = require("../auth");
const { route } = require("./orders");

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ _id }, "mySecret", {
    expiresIn: 60 * 60 * 24 * 365,
  });
};

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  crypto.randomBytes(16, (err, salt) => {
    const newSalt = salt.toString("base64");
    crypto.pbkdf2(password, newSalt, 1000, 64, "sha1", (err, key) => {
      const encryptedPassword = key.toString("base64");
      Users.findOne({ email })
        .exec()
        .then((user) => {
          if (user) {
            return res.send("User already exists");
          }
          Users.create({
            email,
            password: encryptedPassword,
            salt: newSalt,
          }).then(() => {
            res.send("User created successfully");
          });
        });
    });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  Users.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.send("user no exists");
      }
      crypto.pbkdf2(password, user.salt, 1000, 64, "sha1", (err, key) => {
        const encryptedPassword = key.toString("base64");
        if (user.password === encryptedPassword) {
          const token = signToken(user._id);
          return res.send({ token });
        }
        return res.send("user or password incorrect");
      });
    });
});

router.get("/me", isAuthenticated, (req, res) => {
  res.send(req.user);
});

module.exports = router;
