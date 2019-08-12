const express = require('express');
const { User, functions, sanitizer } = require('@scaling-parakeet/database');
const { getUserAsObject, validateUser, saveUser } = require('./../utils/auth-functions');
const router = express.Router();

const { getMongooseErrorMessages } = functions;
const { sanitizeString, sanitizeObject, sanitizeStringsOfAnObject} = sanitizer;

/*
 * Registers a user account.
 * This is a public api and it is heavily used.
 */
router.post('/', (request, response) => {
    registerUser(request, response);
});

// Gets the user request -> Transforms it into JS Object -> Validates the input -> Creates the account and saves it into the database.
async function registerUser(request, response) {
    const cleanObject = sanitizeObject(request.body);
    const user = getUserAsObject(cleanObject);
    const result = await validateUser(user);
    if (result.isValid) {
        saveUs(user, response);
    } else {
        response.status(400).send(result.error);
    }
}
