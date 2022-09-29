const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const Middleware = require('../middlewares/middleware');
router
    .route("/")
    .get(Middleware.isAuthenticated,UserController.getAllUsers)
    .post(UserController.createUserProfile)
    
router
    .route("/:id")
    .get(Middleware.isAuthenticated, UserController.getUserProfile)
    .patch(Middleware.isAuthenticated, UserController.updateUserProfile)
    .delete(Middleware.isAuthenticated, UserController.deleteUserProfile)
    
module.exports = router;