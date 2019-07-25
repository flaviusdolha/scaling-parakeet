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
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    content: {
        type: Object,
        required: true
    },
    author: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    publicationDate: {
        type: Date,
        unique: true
    },
    likes: {
        type: Number,
        default: 0,
        min: 0,
        max: 9999
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
    const createPost = async () => {
        const post = getPostAsObject(request.body);
        const result = await validatePost(post);
        if (result.isValid) {
            savePost(post, response);
        } else {
            response.status(400).send(result.error);
        }
    };
    createPost();
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
async function validatePost(post) {
    try {
        await post.validate();
        return {
            isValid: true,
        }
    } catch (e) {
        let errors = getErrorMessages(e);
        return {
            isValid: false,
            error: errors
        }
    }
}

// Saves the post into the database.
async function savePost(post, response) {
    try {
        await post.save();
        response.send(post);
    } catch (e) {
        response.status(400).send(getErrorMessages(e));
    }
}

// Recieves an error object, returns an array of human readable error messages.
function getErrorMessages(e) {
    let errors = [];
    for (field in e.errors) {
        errors.push(e.errors[field].message)
    }
    return errors;
}

module.exports = router;