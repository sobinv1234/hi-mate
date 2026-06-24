const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// in-memory DB
const posts = {};

// GET all posts (FIXED → return ARRAY)
app.get('/posts', (req, res) => {
    res.send(Object.values(posts));
});

// CREATE post
app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');

    const {
        title,
        description,
        productAmount,
        productImage
    } = req.body;

    posts[id] = {
        id,
        title,
        description,
        productAmount,
        productImage
    };

    res.status(201).send(posts[id]);
});

app.listen(4000, () => {
    console.log('Posts service running on 4000');
});