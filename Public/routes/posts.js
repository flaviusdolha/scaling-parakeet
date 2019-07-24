const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/*
 * Defines how should a post be structured.
 * Every post must have title, content, author and creationDate.
 * The others fields are optional, but it would be good to be.
 */
const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: Object,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    publicationDate: Date,
    likes: {
        type: Number,
        default: 0
    },
    comments: Object,
    tags: [String]
});
const Post = new mongoose.model('Post', postSchema);

/*
 * Gets the current post that is running.
 * This is a heavily used api route and should be very secured.
 */
router.get('/current', (request, response) => {
    response.send('Current post');
});

module.exports = router;