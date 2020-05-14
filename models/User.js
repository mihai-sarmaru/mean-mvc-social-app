// Require
const bcrypt = require('bcryptjs');
const validator = require('validator');
const usersCollection = require("../db").db().collection("users");

// Constructor with params and properties
let User = function(receivedData) {
    this.data = receivedData;
    this.errors = [];
}

// Methods
User.prototype.register = function() {
    // Clean up and validate user data
    this.cleanUp();
    this.validate();

    // If there are no validation errors - save user data to DB
    if (!this.errors.length) {
        // Hash user password
        let salt = bcrypt.genSaltSync(10);
        this.data.password = bcrypt.hashSync(this.data.password, salt);

        // Insert user into DB
        usersCollection.insertOne(this.data);
    }
}

User.prototype.login = function() {
    // Using promise instead of traditional callback methods
    return new Promise((resolve, reject) => {
        // Clean up form
        this.cleanUp();

        // Find user in DB - username (use promise)
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                resolve("Congrats!");
            } else {
                reject("Invalid user / password.");
            }
        }).catch((e) => {
            reject("Please try again later.");
        });
    });
}

User.prototype.validate = function() {
    if (this.data.username == "") {this.errors.push("You must provide a username.")}
    if (this.data.password == "") {this.errors.push("You must provide a password.")}

    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
    if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}

    if (this.data.password.username > 0 && this.data.password.length < 4) {this.errors.push("Username must be at least 4 characters.")}
    if (this.data.password.username > 0) {this.errors.push("Username cannot exceed 30 characters.")}

    if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters.")}
    if (this.data.password.length > 50) {this.errors.push("Password cannot exceed 50 characters.")}
}

User.prototype.cleanUp = function() {
    // Make sure fields are string
    if (typeof(this.data.username) != "string") {this.data.username = ""}
    if (typeof(this.data.email) != "string") {this.data.email = ""}
    if (typeof(this.data.password) != "string") {this.data.password = ""}

    // Get rid of misc properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

// Export User model function
module.exports = User;