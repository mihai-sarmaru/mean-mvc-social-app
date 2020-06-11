// Require User model
const User = require('../models/User');
const Post = require("../models/Post");
const Follow = require("../models/Follow");

//
exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
        // Express run next function in route
        next();
    } else {
        req.flash("errors", "You must be logged in to perform that action.");
        req.session.save(() => {
            res.redirect("/");
        });

    }
}

// Login function
exports.login = function(req, res) {
    let user = new User(req.body);
    // Using promises instead of callback
    user.login().then((result) => {
        // Use session object and save it manually
        req.session.user = {_id: user.data._id, username: user.data.username, avatar: user.avatar};
        req.session.save(() => {
            res.redirect("/");
        });
    }).catch((e) => {
        // Add flash message and redirect to home
        req.flash("errors", e);
        req.session.save(() => {
            res.redirect("/");
        });
    });
}

// Logout function
exports.logout = function(req, res) {
    // Destroy session and use callback for response
    req.session.destroy(() => {
        res.redirect("/");
    });
}

// Register user function
exports.register = function(req, res) {
    // Create new User object
    let user = new User(req.body);
    user.register().then(() => {
        // Create session data and redirect
        req.session.user = {_id: user.data._id, username: user.data.username, avatar: user.avatar};
        req.session.save(() => {
            res.redirect("/");
        });
    }).catch((regErrors) => {
        // Use flash messages
        regErrors.forEach((error) => {
            req.flash("regErrors", error);
        });
        req.session.save(() => {
            res.redirect("/");
        });
    });
}

// Home function
exports.home = async function(req, res) {
    // Check for session
    if (req.session.user) {
        // Get posts feed for current user
        let posts = await Post.getFeed(req.session.user._id);
        res.render("home-dashboard", {posts: posts});
    } else {
        // Pass errors flash message
        res.render("home-guest", {regErrors: req.flash("regErrors")});
    }
}

// Check if user exists function
exports.ifUserExists = function(req, res, next) {
    User.findByUsername(req.params.username).then((userDocument) => {
        // Return user document and sore it in request object as profileUser
        req.profileUser = userDocument;
        next();
    }).catch(() => {
        res.render("404");
    });
}

// Profile posts screen function
exports.profilePostsScreen = function(req, res) {
    // Ask post model for post by an author ID
    Post.findByAuthorID(req.profileUser._id).then((posts) => {
        res.render("profile", {
            currentPage: "posts",
            posts: posts,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        });
    }).catch(() => {
        res.render("404");
    });
}

// Profile followers screen function
exports.profileFollowersScreen = async function(req, res) {
    try {
        let followers = await Follow.getFollowersByID(req.profileUser._id);
        res.render("profile-followers", {
            currentPage: "followers",
            followers: followers,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        });
    } catch {
        res.render("404");
    }
}

// Profile following screen function
exports.profileFollowingScreen = async function(req, res) {
    try {
        let following = await Follow.getFollowingByID(req.profileUser._id);
        res.render("profile-following", {
            currentPage: "following",
            following: following,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        });
    } catch {
        res.render("404");
    }
}

// Shared profile function
exports.sharedProfileData = async function(req, res, next) {
    let isFollowing = false;
    let isVisitorsProfile = false;
    if (req.session.user) {
        isVisitorsProfile = req.profileUser._id.equals(req.session.user._id);
        isFollowing = await Follow.isVisitorFollowing(req.profileUser._id, req.visitorID);
    }
    req.isFollowing = isFollowing;
    req.isVisitorsProfile = isVisitorsProfile;

    // get post, followers, following counts
    let postCountPromise = Post.countPostsByAuthor(req.profileUser._id);
    let followerCountPromise = Follow.countFollowersByID(req.profileUser._id);
    let followingCountPromise = Follow.countFollowingByID(req.profileUser._id);

    // Wait for all promises to complete - returns array
    // returned array destructuring
    let [postCount, followerCount, followingCount] = await Promise.all([postCountPromise, followerCountPromise, followingCountPromise]);

    // Add destructed results to request object
    req.postCount = postCount;
    req.followerCount = followerCount;
    req.followingCount = followingCount;

    next();
}