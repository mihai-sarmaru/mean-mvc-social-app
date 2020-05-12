// Require User model
const User = require('../models/User');

// Login function
exports.login = function() {

}

//Logout function
exports.logout = function() {
    
}

// Register user function
exports.register = function(req, res) {
    // Create new User object
    let user = new User(req.body);
    user.register();
    res.send("Thanks for registring");
}

// Home function
exports.home = function(req, res) {
    res.render("home-guest");
}