// Require User model
const User = require('../models/User');

// Login function
exports.login = function(req, res) {
    let user = new User(req.body);
    // Using promises instead of callback
    user.login().then((result) => {
        // Use session object
        req.session.user = {username: user.data.username};
        res.send(result);
    }).catch((e) => {
        res.send(e);
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
    user.register();

    // Check for registration errors
    if (user.errors.length) {
        res.send(user.errors);
    } else {
        res.send("Congrats, no errors");
    }
}

// Home function
exports.home = function(req, res) {
    // Check for session
    if (req.session.user) {
        res.render("home-dashboard", {username: req.session.user.username});
    } else {
        res.render("home-guest");
    }
}