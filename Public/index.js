const express = require('express');
const path = require('path');
const posts = require('./routes/posts');

const app = express();
const PORT = process.env.PORT = 3000;

// Middlewares
app.use('/api/posts/', posts);

/*
 * Handles the default URL page.
 */
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../Client/public', 'index.html'));
});

/*
 * The app listens for the specified PORT bellow.
 */
app.listen(PORT, () => console.log('Server running...'));