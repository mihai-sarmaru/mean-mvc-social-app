// Require packages
const express = require("express");
const session = require("express-session");
const router = require("./router");

// Express app
const app = express();

// Session configuration
let sessionOptions = session({
    secret: "this is a string that should not be guessed",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
});

// Use submitted user data to request object, JSON data, sessions
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(sessionOptions);

// Setup public folder
app.use(express.static("public"));
// Let express know the views folder
app.set("views", "views");
// Use template engine
app.set("view engine", "ejs");

// Use main router
app.use("/", router);

// Export express application
module.exports = app;