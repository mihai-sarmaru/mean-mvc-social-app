// Require packages
const express = require("express");
const session = require("express-session");
const markdown = require("marked");
const sanitizeHTML = require("sanitize-html");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo")(session);
const router = require("./router");

// Express app
const app = express();

// Session configuration
let sessionOptions = session({
    secret: "this is a string that should not be guessed",
    store: new MongoStore({client: require("./db")}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
});

// Use submitted user data to request object, JSON data, sessions, flash messages
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(sessionOptions);
app.use(flash());

// Run this function for every request
app.use((req, res, next) => {
    // Markdown available in EJS templates
    res.locals.filterUserHTML = function(content) {
        return sanitizeHTML(markdown(content), {
            allowedTags: ["p", "br", "ul", "ol", "li", "strong", "bold", "i", "em", "h1", "h2", "h3", "h4", "h5", "h6"],
            allowedAttributes: {}
        });
    }

    // Make all error and success flash mesages available from all templates
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");

    // Make user ID available on the req object
    if (req.session.user) {req.visitorID = req.session.user._id}
    else {req.visitorID = 0}

    // Have user property in EJS
    res.locals.user = req.session.user;
    next();
});

// Setup public folder
app.use(express.static("public"));
// Let express know the views folder
app.set("views", "views");
// Use template engine
app.set("view engine", "ejs");

// Use main router
app.use("/", router);

// Server that uses Express app as it's handler
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// test docket connection
io.on("connection", () => {
    console.log("New user connected.");
});

// Export server application
module.exports = server;