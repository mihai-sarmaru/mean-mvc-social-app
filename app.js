// Require packages
const express = require("express");

// Express app
const app = express();

// Setup public folder
app.use(express.static("public"));
// Let express know the views folder
app.set("views", "views");
// Use template engine
app.set("view engine", "ejs");

// Home page GET route
app.get("/", (req, res) => {
    res.render("home-guest");
});

// Listen on port 3000
app.listen(3000);