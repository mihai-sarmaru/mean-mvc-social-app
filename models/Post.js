// Require
const postsCollection = require("../db").db().collection("posts");
const ObjectID = require("mongodb").ObjectID;
const User = require("./User");

// Constructor
let Post = function(data, userid) {
    this.data = data;
    this.userid = userid;
    this.errors = [];
}

// Create method
Post.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        this.validate();

        // Check for errors
        if (!this.errors.length) {
            // Insert post into DB
            postsCollection.insertOne(this.data).then(() => {
                resolve();
            }).catch(() => {
                this.errors.push("Please try again later");
                reject(this.errors);
            });
        } else {
            reject(this.errors);
        }
    });
}

Post.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") { this.data.title = "" }
    if (typeof(this.data.body) != "string") { this.data.body = "" }

    // Get rid of misc properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date(),
        author: ObjectID(this.userid)
    }
}

Post.prototype.validate = function() {
    if (this.data.title == "") {this.errors.push("You must provide a title.")}
    if (this.data.body == "") {this.errors.push("You must provide post content.")}
}

// Static method
Post.findSingleByID = function(id) {
    return new Promise(async function(resolve, reject) {
        // Check if ID is valid (avoid injection)
        if (typeof(id) != "string" || !ObjectID.isValid(id)) {
            reject();
            return;
        }

        // Find post by ID from mongo DB
        // Aggregate - array of multiple object operations
        let posts = await postsCollection.aggregate([
            // Select post by ID
            {$match: {_id: new ObjectID(id)}},
            // Select * from users where localField = foreignField as <alias>
            {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
            // Spell out what resulting aggregate object to have
            {$project: {
                title: 1,
                body: 1,
                createdDate: 1,
                author: {$arrayElemAt: ["$authorDocument", 0]} // first (0) authorDocument element
            }}
        ]).toArray();

        // Clean author (user) property in each post object
        posts = posts.map((post) => {
            post.author = {
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            };
            return post;
        });

        if (posts.length) {
            console.log(posts[0]);
            // Return first item in array
            resolve(posts[0]);
        } else {
            reject();
        }
    });
}

// Export post object
module.exports = Post;