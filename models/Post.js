// Require
const sanitizeHTML = require("sanitize-html");
const postsCollection = require("../db").db().collection("posts");
const ObjectID = require("mongodb").ObjectID;
const User = require("./User");

// Constructor
let Post = function(data, userid, requestedPostID) {
    this.data = data;
    this.userid = userid;
    this.errors = [];
    this.requestedPostID = requestedPostID;
}

// Create method
Post.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        this.validate();

        // Check for errors
        if (!this.errors.length) {
            // Insert post into DB
            postsCollection.insertOne(this.data).then((info) => {
                // Resolve and return new created ID
                resolve(info.ops[0]._id);
            }).catch(() => {
                this.errors.push("Please try again later");
                reject(this.errors);
            });
        } else {
            reject(this.errors);
        }
    });
}

// Update method
Post.prototype.update = function() {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await Post.findSingleByID(this.requestedPostID, this.userid);
            if (post.isVisitorOwner) {
                // Call Update DB method
                let status = await this.updatePostInDB();
                resolve(status);
            } else {
                reject();
            }
        } catch {
            reject();
        }
    });
}

Post.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") { this.data.title = "" }
    if (typeof(this.data.body) != "string") { this.data.body = "" }

    // Get rid of misc properties
    this.data = {
        title: sanitizeHTML(this.data.title.trim(), {allowedTags: [], allowedAttributes: []}),
        body: sanitizeHTML(this.data.body.trim(), {allowedTags: [], allowedAttributes: []}),
        createdDate: new Date(),
        author: ObjectID(this.userid)
    }
}

Post.prototype.validate = function() {
    if (this.data.title == "") {this.errors.push("You must provide a title.")}
    if (this.data.body == "") {this.errors.push("You must provide post content.")}
}

// Update post in db method
Post.prototype.updatePostInDB = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        this.validate();
        if (!this.errors.length) {
            // Update document in mongo DB
            await postsCollection.findOneAndUpdate(
                    {_id: new ObjectID(this.requestedPostID)},
                    {$set: {title: this.data.title, body: this.data.body}}
                );
            resolve("success");
        } else {
            resolve("failure");
        }
    });
}

// Static method
Post.reusablePostQuery = function(uniqueOperations, visitorID) {
    return new Promise(async function(resolve, reject) {
        // Concat to the original array with aggregates
        let aggOperations = uniqueOperations.concat([
            // Select * from users where localField = foreignField as <alias>
            {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
            // Spell out what resulting aggregate object to have
            {$project: {
                title: 1,
                body: 1,
                createdDate: 1,
                authorID: "$author",
                author: {$arrayElemAt: ["$authorDocument", 0]} // first (0) authorDocument element
            }}
        ]);

        // Find post by ID from mongo DB
        // Aggregate - array of multiple object operations
        let posts = await postsCollection.aggregate(aggOperations).toArray();

        // Clean author (user) property in each post object
        posts = posts.map((post) => {
            // Check is visitor is post owner
            post.isVisitorOwner = post.authorID.equals(visitorID);
            post.authorID = undefined;

            post.author = {
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            };
            return post;
        });
        //
        resolve(posts);
    });
}

Post.findSingleByID = function(id, visitorID) {
    return new Promise(async function(resolve, reject) {
        // Check if ID is valid (avoid injection)
        if (typeof(id) != "string" || !ObjectID.isValid(id)) {
            reject();
            return;
        }

        // Pass array of operations
        let posts = await Post.reusablePostQuery([
            {$match: {_id: new ObjectID(id)}}
        ], visitorID);

        if (posts.length) {
            console.log(posts[0]);
            // Return first item in array
            resolve(posts[0]);
        } else {
            reject();
        }
    });
}

Post.findByAuthorID = function(authorID) {
    // Search by author id, and sort descending (-1) 
    return Post.reusablePostQuery([
        {$match: {author: authorID}},
        {$sort: {createdDate: -1}}
    ]);
}

// Delete post from DB
Post.delete = function(postIDToDelete, currentUserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await Post.findSingleByID(postIDToDelete, currentUserID);
            if (post.isVisitorOwner) {
                await postsCollection.deleteOne({_id: new ObjectID(postIDToDelete)});
                resolve();
            } else {
                reject();
            }
        } catch {
            reject();
        }
    });
}

// Search post in DB
Post.search = function(searchTerm) {
    return new Promise(async (resolve, reject) => {
        if (typeof(searchTerm) == "string") {
            // Search DB - array of aggregate operations
            let posts = await Post.reusablePostQuery([
                {$match: {$text: {$search: searchTerm}}},
                {$sort: {score: {$meta: "textScore"}}} // sort by relevance
            ]);
            resolve(posts);
        } else {
            reject();
        }
    });
}

// Count posts in DB
Post.countPostsByAuthor = function(id) {
    return new Promise(async (resolve, reject) => {
        let postCount = await postsCollection.countDocuments({author: id});
        resolve(postCount);
    });
}

// Export post object
module.exports = Post;