const express = require('express');

const app = express();
const PORT = process.env.PORT = 3000;

/*
 * The app listens for the specified PORT bellow.
 */
app.listen(PORT, () => console.log('Server running...'));