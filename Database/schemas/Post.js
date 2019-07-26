const mongoose = require('mongoose');

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
        type: Date
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

module.exports = Post;