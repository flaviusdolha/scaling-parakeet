const { User, functions, sanitizer } = require('@scaling-parakeet/database');

const { getMongooseErrorMessages } = functions;
const { sanitizeStringsOfAnObject } = sanitizer;

// Returns the object from the JSON request.
function getUserAsObject(requestBody) {
    const cleanBody = sanitizeStringsOfAnObject(requestBody);
    const {
        email,
        verifiedEmail,
        registrationDate,
        firstName,
        lastName,
        birthday,
        gender,
        location,
        devicesTokens,
        permissionsFlags,
        rankTitle
    } = cleanBody;
    const user = new User({
        email,
        verifiedEmail,
        registrationDate,
        firstName,
        lastName,
        birthday,
        gender,
        location,
        devicesTokens,
        permissionsFlags,
        rankTitle
    });
    return user;
}

// Validates each input of the user to match the requirements defined in the schema.
async function validateUser(user) {
    try {
        await user.validate();
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

// Saves the user into the database.
async function saveUser(user, response) {
    try {
        await user.save();
        response.send(user);
    } catch (e) {
        response.status(400).send(getMongooseErrorMessages(e));
    }
}

module.exports = {
    getUserAsObject,
    validateUser,
    saveUser
};
