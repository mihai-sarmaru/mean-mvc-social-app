// Constructor with params and properties
let User = function(receivedData) {
    this.data = receivedData;
    this.errors = [];
}

// Methods
User.prototype.register = function() {
    // Validate user data
    this.validate();

    // If there are no validation errors - save user data to DB
}

User.prototype.validate = function() {
    if (this.data.username == "") {this.errors.push("You must provide a username.")}
    if (this.data.email == "") {this.errors.push("You must provide a valid email address.")}
    if (this.data.password == "") {this.errors.push("You must provide a password.")}

    if (this.data.password.username > 0 && this.data.password.length < 4) {this.errors.push("Username must be at least 4 characters.")}
    if (this.data.password.username > 0) {this.errors.push("Username cannot exceed 30 characters.")}

    if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters.")}
    if (this.data.password.length > 100) {this.errors.push("Password cannot exceed 100 characters.")}
}

// Export User model function
module.exports = User;