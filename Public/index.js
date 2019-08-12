const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const posts = require('./routes/posts');

const app = express();
const PORT = process.env.PORT = 3002;

// Routes to specified static files or folders
const DESKTOP_PUBLIC = path.join(__dirname, '../Desktop/public');
const DESKTOP_PUBLIC_INDEX_HTML = path.join(__dirname, '../Desktop/public', 'index.html');

// Connects to the Database Server.
mongoose.connect('mongodb://localhost/main', { useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB...'))
        .catch(e => console.log(e));

// Middlewares
app.use(express.json());
app.use('/api/public/posts/', posts);

/*
 * Handles the default URL page.
 */
app.get('/', (request, response) => {
    response.sendFile(DESKTOP_PUBLIC_INDEX_HTML);
});
app.use('/', express.static(DESKTOP_PUBLIC));

/*
 * The app listens for the specified PORT bellow.
 */
app.listen(PORT, () => console.log('Server running...'));
