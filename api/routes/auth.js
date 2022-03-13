const express = require("express");
const crypto = require("crypto");
const Users = require("../models/Users");
const router = express.Router();

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
  Users.create(req.body).then((x) => res.status(201).send(x));
});

module.exports = router;
