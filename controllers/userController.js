// Require User model
const User = require('../models/User');

// Login function
exports.login = function(req, res) {
    let user = new User(req.body);
    // Using promises instead of callback
    user.login().then((result) => {
        // Use session object and save it manually
        req.session.user = {username: user.data.username};
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
        req.session.user = {username: user.data.username};
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
        res.render("home-dashboard", {username: req.session.user.username});
    } else {
        // Pass errors flash message
        res.render("home-guest", {errors: req.flash("errors"), regErrors: req.flash("regErrors")});
    }
}