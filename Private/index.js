const express = require('express');
const mongoose = require('mongoose')
const posts = require('./routes/posts');

const app = express();
const PORT = process.env.PORT = 3000;

// Connects to the Database Server.
mongoose.connect('mongodb://localhost/main', { useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB...'))
        .catch(e => console.log(e));

// Middlewares
app.use(express.json());
app.use('/api/private/posts/', posts);

/*
 * The app listens for the specified PORT bellow.
 */
app.listen(PORT, () => console.log('Server running...'));