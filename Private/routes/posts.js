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
        trim: true
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

// Sets the property of every update function so that it validates before saving into the database.
// It does return every time the updated post.
postSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    this.options.new = true;
    next();
});

const Post = new mongoose.model('Post', postSchema);

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
            const updatedPost = await Post.findOneAndUpdate({ _id: request.params.id }, request.body)
            response.send(updatedPost);
        } catch (e) {
            if (e.name === 'CastError' && e.path === '_id') {
                return response.status(404).send({ error: 'Resource with the given id was not found' });
            }
            const errors = getErrorMessages(e);
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
        const errors = getErrorMessages(e);
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

// Recieves an error object, returns an array or an object of human readable error messages.
function getErrorMessages(e) {
    let errors = [];
    for (field in e.errors) {
        errors.push(e.errors[field].message);
    }

    // If the error is not found in the path above, it is found in the path bellow.
    if (errors.length === 0) {
        errors.push(e.message);
    }
    return errors;
}

// Gets an array of strings and returns the final string, concatenating all of them.
function getConcatenatedString(strings) {
    let concatenatedString = '';
    for (let i = 0; i < strings.length; i++) {
        concatenatedString.concat(strings[i]);
    }
    return concatenatedString;
}

module.exports = router;