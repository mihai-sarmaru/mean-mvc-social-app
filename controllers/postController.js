// Require
const Post = require("../models/Post");

// Create post method
exports.viewCreateScreen = function(req, res) {
    res.render("create-post");
}

// Create post method
exports.create = function(req, res) {
    let post = new Post(req.body, req.session.user._id);
    post.create().then((newID) => {
        // Redirect to view new post
        req.flash("success", "New post successfully created.");
        req.session.save(() => res.redirect(`/post/${newID}`));
    }).catch((errors) => {
        // Flash error and continue
        errors.forEach(error => req.flash("errors", error));
        req.session.save(() => res.redirect("/create-post"));
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
        // Check visitor is author
        if (post.authorID == req.visitorID) {
            res.render("edit-post", {post: post});
        } else {
            req.flash("errors", "You do not have permission to perform thant action.");
            req.session.send(() => res.redirect("/"));
        }
    } catch {
        res.render("404");
    }
}

// Edit post
exports.edit = function(req, res) {
    let post = new Post(req.body, req.visitorID, req.params.id);
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

// Delete post
exports.delete = function(req, res) {
    Post.delete(req.params.id, req.visitorID).then(() => {
        req.flash("success", "Post successfully deleted.");
        req.session.save(() => res.redirect(`/profile/${req.session.user.username}`));
    }).catch(() => {
        req.flash("errors", "You do not have permission to perform that action.");
        req.session.save(() => res.redirect("/"));
    });
}