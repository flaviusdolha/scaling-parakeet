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
 * Creates a new post in the database.
 * This is not a public api, only authorized users can acces it.
 * 
 * Get the post request -> Transform it into JS Object -> Validate the input -> Save the post into database.
 */
router.post('/', (request, response) => {
    const post = getPostAsObject(request.body);
    const result = validatePost(post);
    if (result.isValid) {
        savePost(post, response);
    } else {
        response.send(result.error);
    }
});

/*
 * Gets the current post that is running.
 * This is a heavily used api route and should be very secured.
 */
router.get('/current', (request, response) => {
    response.send('Current post');
});

// Returns the object from the JSON request.
function getPostAsObject(requestBody) {
    const { title, content, author, creationDate, publicationDate, likes, comments, tags } = requestBody;
    const post = new Post({
        title,
        content,
        author,
        creationDate,
        publicationDate,
        likes,
        comments,
        tags
    })
    return post;
}

// Validates each input of the post to match the requirements defined in the schema.
function validatePost(post) {
    try {
        post.validate();
        return {
            isValid: true,
        }
    } catch (e) {
        return {
            isValid: false,
            error: e.message
        }
    }
}

// Saves the post into the database.
function savePost(post, response) {
    try {
        post.save()
        response.send(post);
    } catch (e) {
        response.send(e.message);
    }
}

module.exports = router;