const express = require('express');
const sanitize = require('mongo-sanitize');
const { Post, functions } = require('@scaling-parakeet/database');
const router = express.Router();

const { getMongooseErrorMessages } = functions;

/*
 * Gets the current post that is running.
 * This is a heavily used api route and should be very secured.
 */
router.get('/current', (request, response) => {
    response.send('Current post');
});

/*
 * Updates a specified post with the given resources.
 * This api is public and only @likes and @comments can be modified from the object sent.
 */
router.put('/:id', (request, response) => {
    updatePost(request, response);
});

// Processes and updates a post with resource given.
async function updatePost(request, response) {
    try {
        const { likes, comments } = request.body
        const updates = { likes, comments };
        const id = request.params.id;
        const updatedPost = await Post.findOneAndUpdate({ _id: id }, updates);
        response.send(updatedPost);
    } catch (e) {
        // The if bellow checks if the error is related to resource not found.
        if (e.name === 'CastError' && e.path === '_id') {
            return response.status(404).send({ error: 'Resource with the given id was not found.'});
        }
        const errors = getMongooseErrorMessages(e);
        response.status(400).send(errors);
    }
}

module.exports = router;