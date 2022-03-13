const express = require('express');
const Users = require('../models/Users')
const router = express.Router();


router.post('/register', (req, res) => {
    Users.create(req.body)
        .then(x => res.status(201).send(x));
});

router.post('/login', (req, res) => {
    Users.create(req.body)
        .then(x => res.status(201).send(x));
});

module.exports = router;