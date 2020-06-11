// Require express and setup router
const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const followController = require('./controllers/followController');

// Main route
router.get("/", userController.home);

// User routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// Profile routes
router.get("/profile/:username", userController.ifUserExists, userController.sharedProfileData, userController.profilePostsScreen);
router.get("/profile/:username/followers", userController.ifUserExists, userController.sharedProfileData, userController.profileFollowersScreen);
router.get("/profile/:username/following", userController.ifUserExists, userController.sharedProfileData, userController.profileFollowingScreen);

// Post routes
router.get("/post/:id", postController.viewSingle);
router.get("/create-post", userController.mustBeLoggedIn, postController.viewCreateScreen);
router.post("/create-post", userController.mustBeLoggedIn, postController.create);
router.get("/post/:id/edit", userController.mustBeLoggedIn, postController.viewEditScreen);
router.post("/post/:id/edit", userController.mustBeLoggedIn, postController.edit);
router.post("/post/:id/delete", userController.mustBeLoggedIn, postController.delete);

// Search routes
router.post("/search", postController.search);

// Follow routes
router.post("/addFollow/:username", userController.mustBeLoggedIn, followController.addFollow);
router.post("/removeFollow/:username", userController.mustBeLoggedIn, followController.removeFollow);

// Export router
module.exports = router;