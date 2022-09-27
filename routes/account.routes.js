const router = require('express').Router()
const AccountController = require('../controllers/account.controller');

router
    .route("/")
    .post(AccountController.createAccount)
    .get(AccountController.getAccountById)

router
    .route("/:id")
    .get(AccountController.getAccountById)
    .patch(AccountController.updateAccount)
    .delete(AccountController.deleteAccount)
    


module.exports = router;