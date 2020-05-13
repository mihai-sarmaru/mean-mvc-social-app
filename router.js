// Require express and setup router
const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

// GET requests
router.get("/", userController.home);

// POST requests
router.post("/register", userController.register);
router.post("/login", userController.login);

// Export router
module.exports = router;