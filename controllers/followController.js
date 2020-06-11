// Require follow model
const Follow = require("../models/Follow");

// Add follow
exports.addFollow = function(req, res) {
    let follow = new Follow(req.params.username, req.visitorID);
    follow.create().then(() => {
        req.flash("success", `Successfully followed ${req.params.username}`);
        req.session.save(() => res.redirect(`/profile/${req.params.username}`));
    }).catch((errors) => {
        errors.forEach(error => {
            req.flash("errors", error);
            req.session.save(() => res.redirect("/"));
        });
    });
}

// Add remove
exports.removeFollow = function(req, res) {
    let follow = new Follow(req.params.username, req.visitorID);
    follow.delete().then(() => {
        req.flash("success", `Successfully stopped following ${req.params.username}`);
        req.session.save(() => res.redirect(`/profile/${req.params.username}`));
    }).catch((errors) => {
        errors.forEach(error => {
            req.flash("errors", error);
            req.session.save(() => res.redirect("/"));
        });
    });
}