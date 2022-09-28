const router = require('express').Router()


router
    .route("/")
    .post(AuthController.authenticate);

module.exports = router;