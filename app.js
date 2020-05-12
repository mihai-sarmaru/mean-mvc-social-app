// Require packages
const express = require("express");

// Express app
const app = express();

// Home page GET route
app.get("/", (req, res) => {
    res.send("Welcome to our new app");
});

// Listen on port 3000
app.listen(3000);