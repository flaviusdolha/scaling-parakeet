const mongoose = require('mongoose');

/*
 * Defines how should likes element of a post be structured.
 * Every likes field must have a count and emails of those who liked.
 */
const likesSchema = mongoose.Schema({
    count: {
        type: Number,
        required: true,
        min: 0,
        max: 99999,
    },
    emails: {
        type: [String],
        required: true,
    }
}, { _id: false });

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
        type: likesSchema,
        required: true
    },
    comments: Object,
    tags: [String]
});

// Checks if the specified array has duplicates
function checkForDuplicates(array) {
    const result = array.filter((item, index) => array.indexOf(item) != index);
    if (result.length >= 1) {
        return true;
    } else {
        return false;
    }
}

// Emails field of likes cannot have the same email multiple times.
// Emails and counts must have the same number.
// Each like is assigned to one unique email.
postSchema.path('likes').validate(function (value) {
    if (value.count !== value.emails.length) {
        return false
    } else {
        return !checkForDuplicates(value.emails);
    }
}, 'You cannot have the same email to like multiple times or the number of likes count is not the same as the number of emails.');

// Sets the property of every update function so that it validates before saving into the database.
// It does return every time the updated post.
postSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    this.options.new = true;
    this.options.useFindAndModify = false;
    next();
});

const Post = new mongoose.model('Post', postSchema);

module.exports = Post;