// Require


// Constructor
let post = function(data) {
    this.data = data;
    this.errors = [];
}

// Create method
post.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        this.validate();

        // Check for errors
        if (!this.errors.length) {
            // Insert post into DB
        } else {
            reject(this.errors);
        }
    });
}

post.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") { this.data.title = "" }
    if (typeof(this.data.body) != "string") { this.data.body = "" }

    // Get rid of misc properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date()
    }
}

post.prototype.validate = function() {
    if (this.data.title == "") {this.errors.push("You must provide a title.")}
    if (this.data.body == "") {this.errors.push("You must provide post content.")}
}

// Export post object
module.exports = post;