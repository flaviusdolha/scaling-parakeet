// Removes every '$' from the beginning of the string.
function removeDollarSignsFromBeginning(input) {
    let cleanString = '';
    do {
        cleanString = input.replace('$', '');
    } while (cleanString[0] === '$');
    return cleanString;
}

/*
 * Gets a string and returns a sanitized one.
 * It prevents NoSQL Injections.
 */
function sanitizeString(string) {
    let cleanString = removeDollarSignsFromBeginning(string);
    return cleanString;
}

/*
 * Gets an object and sanitizes its keys.
 * It prevents NoSQL Injections.
 */
function sanitizeObject(object) {
    const keys = Object.keys(object);
    for (key in keys) {
      const value = object[keys[key]];
      delete object[keys[key]];
      const cleanKey = removeDollarSignsFromBeginning(keys[key]);
      object[cleanKey] = value;
    }
}

module.exports = { sanitizeString, sanitizeObject };