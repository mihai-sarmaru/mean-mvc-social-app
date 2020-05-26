// Require
const Post = require("../models/Post");

// Create post method
exports.viewCreateScreen = function(req, res) {
    res.render("create-post");
}

// Create post method
exports.create = function(req, res) {
    let post = new Post(req.body, req.session.user._id);
    post.create().then(() => {
        res.send("New post created.");
    }).catch((errors) => {
        res.send(errors);
    });
}

// View single post
exports.viewSingle = async function(req, res) {
    try {
        // Get router ID param
        let post = await Post.findSingleByID(req.params.id, req.visitorID);
        res.render("single-post-screen", {post: post});
    } catch {
        res.render("404");
    }
}

// Edit post screen
exports.viewEditScreen = async function(req, res) {
    try {
        let post = await Post.findSingleByID(req.params.id);
        res.render("edit-post", {post: post});
    } catch {
        res.render("404");
    }
}

// Edit post
exports.edit = function(req, res) {
    let post = new Post(req.body);
    // Call update method
    post.update().then((status) => {
        // Post was updated successfully in DB
        // User has permission, but there are validation errors
        if (status == "success") {
            // Post updated in DB
            req.flash("success", "Post successfully updated.");
            req.session.save(() => {
                res.redirect(`/post/${req.params.id}/edit`);
            });
        } else {
            post.errors.forEach((error) => {
                req.flash("errors", error);
                req.session.save(() => {
                    res.redirect(`/post/${req.params.id}/edit`);
                });
            });
        }
    }).catch(() => {
        // Post with ID does not exist
        // Current visitor is not owner
        req.flash("errors", "You do not have permission to perform that action.");
        req.session.save(() => {
            res.redirect("/");
        });
    });
}