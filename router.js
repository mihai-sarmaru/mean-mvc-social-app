// Require express and setup router
const express = require('express');
const router = express.Router();

// Home page GET request
router.get("/", (req, res) => {
    res.render("home-guest");
});

// Export router
module.exports = router;