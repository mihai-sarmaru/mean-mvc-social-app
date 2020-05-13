// Require packages
const express = require("express");
const router = require("./router");

// Express app
const app = express();

// Use submitted data to request object, and JSON data
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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