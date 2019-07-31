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
 * Gets an object and sanitizes its strings.
 * It prevetns NoSQL Injections.
 */
function sanitizeStringsOfAnObject(object) {
    const keys = Object.keys(object);
    for (key in keys) {
        const value = object[keys[key]];
        if (typeof value === 'object')  {
            sanitizeStringsOfAnObject(value);
        } else {
            const cleanValue = removeDollarSignsFromBeginning(value);
            object[keys[key]] = cleanValue;
        }
    }
    return object;
}

/*
 * Gets an object and sanitizes its keys.
 * It prevents NoSQL Injections.
 */
function sanitizeObject(object) {
    const keys = Object.keys(object);
    for (key in keys) {
        const value = object[keys[key]];
        if (typeof value === 'object') {
            sanitizeObject(value);
        } else {
            delete value;
            const cleanKey = removeDollarSignsFromBeginning(keys[key]);
            object[cleanKey] = value;
        }
    }
}

module.exports = { sanitizeString, sanitizeObject, sanitizeStringsOfAnObject };