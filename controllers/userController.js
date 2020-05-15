// Require User model
const User = require('../models/User');

//
exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
        // Express run next function in route
        next();
    } else {
        req.flash("errors", "You must be logged in to perform that action.");
        req.session.save(() => {
            res.redirect("/");
        });

    }
}

// Login function
exports.login = function(req, res) {
    let user = new User(req.body);
    // Using promises instead of callback
    user.login().then((result) => {
        // Use session object and save it manually
        req.session.user = {username: user.data.username, avatar: user.avatar};
        req.session.save(() => {
            res.redirect("/");
        });
    }).catch((e) => {
        // Add flash message and redirect to home
        req.flash("errors", e);
        req.session.save(() => {
            res.redirect("/");
        });
    });
}

// Logout function
exports.logout = function(req, res) {
    // Destroy session and use callback for response
    req.session.destroy(() => {
        res.redirect("/");
    });
}

// Register user function
exports.register = function(req, res) {
    // Create new User object
    let user = new User(req.body);
    user.register().then(() => {
        // Create session data and redirect
        req.session.user = {username: user.data.username, avatar: user.avatar};
        req.session.save(() => {
            res.redirect("/");
        });
    }).catch((regErrors) => {
        // Use flash messages
        regErrors.forEach((error) => {
            req.flash("regErrors", error);
        });
        req.session.save(() => {
            res.redirect("/");
        });
    });
}

// Home function
exports.home = function(req, res) {
    // Check for session
    if (req.session.user) {
        // Pass session username
        res.render("home-dashboard", {username: req.session.user.username, avatar: req.session.user.avatar});
    } else {
        // Pass errors flash message
        res.render("home-guest", {errors: req.flash("errors"), regErrors: req.flash("regErrors")});
    }
}