const { Post, functions, sanitizer } = require('@scaling-parakeet/database');

const { getMongooseErrorMessages } = functions;
const { sanitizeStringsOfAnObject } = sanitizer;

// Returns the object from the JSON request.
function getPostAsObject(requestBody) {
    const cleanBody = sanitizeStringsOfAnObject(requestBody);
    const { title, content, author, creationDate, publicationDate, likes, comments, tags } = cleanBody;
    const post = new Post({
        title,
        content,
        author,
        creationDate,
        publicationDate,
        likes,
        comments,
        tags
    });
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

module.exports = {
    getPostAsObject,
    validatePost,
    savePost
};
