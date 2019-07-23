const express = require('express');
const app = express();

/*
 * Handles the default URL page.
 */
app.get('/', (request, response) => {
    response.send('Hello, world!');
});

/*
 * The app listens for the specified PORT bellow.
 */
app.listen(3000);