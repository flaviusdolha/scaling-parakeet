const express = require('express');
const { Post, functions } = require('@scaling-parakeet/database');
const router = express.Router();

const { getMongooseErrorMessages } = functions;

/*
 * Creates a new post in the database.
 * This is not a public api, only authorized users can access it.
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

/*
 * Edits a specified post with the given fields.
 * This is not a public api, only authorized users can access it.
 */
router.put('/:id', (request, response) => {
    const updatePost = async () => {
        try {
            const id = request.params.id;
            const updatedPost = await Post.findOneAndUpdate({ _id: id }, request.body)
            response.send(updatedPost);
        } catch (e) {
            // The if bellow checks if the error is related to resrouce not found.
            if (e.name === 'CastError' && e.path === '_id') {
                return response.status(404).send({ error: 'Resource with the given id was not found' });
            }
            const errors = getMongooseErrorMessages(e);
            response.status(400).send(errors);
        }
    };
    updatePost();
});

/*
 * Deletes from the database a specified post.
 * This is not a public api, only authorized users can access it.
 */
router.delete('/:id', (request, response) => {
    const deletePost = async () => {
        try {
            const id = request.params.id;
            await Post.deleteOne({ _id: id });
            const responseString = 'Post '.concat(id, ' succesfully deleted from the database.');
            response.send({ responseString });
        } catch (e) {
            response.status(400).send(e);
        }
    };
    deletePost();
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
        const errors = getMongooseErrorMessages(e);
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
        response.status(400).send(getMongooseErrorMessages(e));
    }
}

module.exports = router;