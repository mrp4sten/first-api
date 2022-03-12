const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// creating app
const app = express();
app.use(bodyParser.json());
app.use(cors());

const meals = require('./routes/meals');
const orders = require('./routes/orders');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/meals', meals);
app.use('/api/orders', orders);

module.exports = app;