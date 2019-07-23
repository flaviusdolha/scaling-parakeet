const express = require('express');
const path = require('path');
const posts = require('./routes/posts');

const app = express();
const PORT = process.env.PORT = 3000;

//
const CLIENT_PUBLIC = path.join(__dirname, '../Client/public');
const CLIENT_PUBLIC_INDEX_HTML = path.join(__dirname, '../Client/public', 'index.html');

// Middlewares
app.use('/api/posts/', posts);

/*
 * Handles the default URL page.
 */
app.get('/', (request, response) => {
    response.sendFile(CLIENT_PUBLIC_INDEX_HTML);
});
app.use('/', express.static(CLIENT_PUBLIC));

/*
 * The app listens for the specified PORT bellow.
 */
app.listen(PORT, () => console.log('Server running...'));