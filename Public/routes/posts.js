const app = require('express');
const router = app.Router();

/*
 * Gets the current and all the previous posts.
 * This is a private route and it is not accessible for the public.
 */
router.get('/', (request, response) => {
    response.send('Posts route');
});

/*
 * Gets the current post that is running.
 * This is a heavily used api route and should be very secured.
 */
router.get('/current', (request, response) => {
    response.send('Current post');
});

module.exports = router;