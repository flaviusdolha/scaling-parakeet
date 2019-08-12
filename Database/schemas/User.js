const mongoose = require('mongoose');

/*
 * Defines how a user should be.
 * Every user must have and email, registrationDate and firstName - lastName.
 */
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    verifiedEmail: {
        type: Boolean,
        default: false
    },
    registrationDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        trim: true
    },
    birthday: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unspecified'],
        default: 'unspecified'
    },
    location: {
        type: String,
    },
    devicesTokens: {
        type: [String],
    },
    permissionsFlags: {
        type: [String],
        default: ['a']
    },
    rankTitle: {
        type: String,
        default: 'User'
    }
});

// Sets the property of every update function so that it validates before saving into the database.
// It does return every time the updated user.
userSchema.pre('findOneAndUpdate', function (next) ) {
  this.options.runValidators = true;
  this.options.new = true;
  this.options.useFindAndModify = false;
  next();
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
