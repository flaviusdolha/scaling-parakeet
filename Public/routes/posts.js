const app = require('express');
const router = app.Router();

/*
 * Gets the current and all the previous posts.
 * This is a private route and it is not accessible for the public.
 */
router.get('/', (request, response) => {
    response.send('Posts route');
});

module.exports = router;