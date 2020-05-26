// Require
const bcrypt = require('bcryptjs');
const validator = require('validator');
const md5 = require("md5");
const usersCollection = require("../db").db().collection("users");

// Constructor with params and properties
let User = function(receivedData, getAvatar) {
    this.data = receivedData;
    this.errors = [];
    if (getAvatar == undefined) {getAvatar = false}
    if (getAvatar) {this.getAvatar();}
}

// Methods
User.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        // Clean up and validate user data
        this.cleanUp();
        await this.validate();
    
        // If there are no validation errors - save user data to DB
        if (!this.errors.length) {
            // Hash user password
            let salt = bcrypt.genSaltSync(10);
            this.data.password = bcrypt.hashSync(this.data.password, salt);
    
            // Insert user into DB
            await usersCollection.insertOne(this.data);
            // Resolve promise
            this.getAvatar();
            resolve();
        } else {
            // Reject promise
            reject(this.errors);
        }
    });
}

User.prototype.login = function() {
    // Using promise instead of traditional callback methods
    return new Promise((resolve, reject) => {
        // Clean up form
        this.cleanUp();

        // Find user in DB - username (use promise)
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                this.data = attemptedUser;
                this.getAvatar();
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
    return new Promise(async (resolve, reject) => {
        if (this.data.username == "") {this.errors.push("You must provide a username.")}
        if (this.data.password == "") {this.errors.push("You must provide a password.")}
    
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
        if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
    
        if (this.data.password.username > 0 && this.data.password.length < 4) {this.errors.push("Username must be at least 4 characters.")}
        if (this.data.password.username > 0) {this.errors.push("Username cannot exceed 30 characters.")}
    
        if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters.")}
        if (this.data.password.length > 50) {this.errors.push("Password cannot exceed 50 characters.")}
    
        // Check to see if username does not exist in DB unsing async
        if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
            let usernameExists = await usersCollection.findOne({username: this.data.username});
            if (usernameExists) {this.errors.push("Username is already taken.")}
        }
    
        // Check to see if email does not exist in DB unsing async
        if (validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({email: this.data.email});
            if (emailExists) {this.errors.push("Email is already being used.")}
        }
        resolve();
    });
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

User.prototype.getAvatar = function() {
    // Gravatar link, email is MD5 hashed, s - size param:
    // https://gravatar.com/avatar/email?s=128
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`;
}

// Static method
User.findByUsername = function (username) {
    return new Promise((resolve, reject) => {
        // Check if username is string
        if (typeof(username) != "string") {
            reject();
            return;
        }

        // Search DB for user by username
        usersCollection.findOne({username: username}).then((userDoc) => {
            if (userDoc) {
                userDoc = new User(userDoc, true);
                userDoc = {
                    _id: userDoc.data._id,
                    username: userDoc.data.username,
                    avatar: userDoc.avatar
                };
                resolve(userDoc);
            } else {
                reject();
            }
        }).catch(() => {
            reject();
        });
    });
}

// Export User model function
module.exports = User;