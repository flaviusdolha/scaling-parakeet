const express = require('express');
const posts = require('./routes/posts');

const app = express();

// Middlewares
app.use('/api/posts/', posts);

/*
 * Handles the default URL page.
 */
app.get('/', (request, response) => {
    response.send('Hello, world!');
});

/*
 * The app listens for the specified PORT bellow.
 */
app.listen(3000);