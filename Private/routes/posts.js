const express = require('express');
const { Post, functions, sanitizer } = require('@scaling-parakeet/database');
const { getPostAsObject, validatePost, savePost } = require('./../utils/post-functions');
const router = express.Router();

const { getMongooseErrorMessages } = functions;
const { sanitizeString, sanitizeObject, sanitizeStringsOfAnObject } = sanitizer;

/*
 * Creates a new post in the database.
 * This is not a public api, only authorized users can access it.
 */ 
router.post('/', (request, response) => {
    createPost(request, response);
});

// Gets the post request -> Transforms it into JS Object -> Validates the input -> Saves the post into database.
async function createPost(request, response) {
    const cleanObject = sanitizeObject(request.body)
    const post = getPostAsObject(cleanObject);
    const result = await validatePost(post);
    if (result.isValid) {
        savePost(post, response);
    } else {
        response.status(400).send(result.error);
    }
}

/*
 * Edits a specified post with the given fields.
 * This is not a public api, only authorized users can access it.
 */
router.put('/:id', (request, response) => {
    updatePost(request, response);
});

// Processes and updates a post with resource given.
async function updatePost(request, response) {
    try {
        const cleanId = sanitizeString(request.params.id);
        const cleanKeys = sanitizeObject(request.body);
        const cleanBody = sanitizeStringsOfAnObject(cleanKeys);
        const id = cleanId;
        const updatedPost = await Post.findOneAndUpdate({ _id: id }, cleanBody);
        response.send(updatedPost);
    } catch (e) {
        // The if bellow checks if the error is related to resrouce not found.
        if (e.name === 'CastError' && e.path === '_id') {
            return response.status(404).send({ error: 'Resource with the given id was not found' });
        }
        const errors = getMongooseErrorMessages(e);
        response.status(400).send(errors);
    }
}

/*
 * Deletes from the database a specified post.
 * This is not a public api, only authorized users can access it.
 */
router.delete('/:id', (request, response) => {
    deletePost(request, response);
});

// Deletes the specified post.
async function deletePost(request, response) {
    try {
        const cleanId = sanitizeString(request.params.id);
        const id = cleanId;
        await Post.deleteOne({ _id: id });
        const responseString = 'Post '.concat(id, ' succesfully deleted from the database.');
        response.send({ responseString });
    } catch (e) {
        response.status(400).send(e);
    }
}

module.exports = router;