// Receieves a mongoose error object, returns an array or an object of human readable error messages.
function getMongooseErrorMessages(e) {
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

module.exports = { getMongooseErrorMessages };