// Require packages
const express = require("express");
const router = require("./router");

// Express app
const app = express();

// Setup public folder
app.use(express.static("public"));
// Let express know the views folder
app.set("views", "views");
// Use template engine
app.set("view engine", "ejs");

// Use main router
app.use("/", router);

// Listen on port 3000
app.listen(3000);