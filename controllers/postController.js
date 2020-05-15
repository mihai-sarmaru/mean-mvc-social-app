// Require
const post = require("../models/Post");

// Create post method
exports.viewCreateScreen = function(req, res) {
    res.render("create-post");
}

// Create post method
exports.create = function(req, res) {
    let post = new post(req.body);
    post.create().then(() => {
        res.send("New post created.");
    }).catch((errors) => {
        res.send(errors);
    });
}