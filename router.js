// Require express and setup router
const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

// Home page GET request
router.get("/", userController.home);

// Export router
module.exports = router;