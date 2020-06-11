// Require database
const usersCollection = require("../db").db().collection("users");
const followsCollection = require("../db").db().collection("follows");
// Require user model
const User = require("./User");
// Require mongo object ID
const ObjectID = require("mongodb").ObjectID;

// Follow object
let Follow = function(followedUsername, authorID) {
    this.followedUsername = followedUsername;
    this.authorID = authorID;
    this.errors = [];
}

// Add follow to DB
Follow.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate("create");
        if (!this.errors.length) {
            // save followers in DB
            await followsCollection.insertOne({followedID: this.followedID, authorID: new ObjectID(this.authorID)});
            resolve();
        } else {
            reject(this.errors);
        }
    });
}

// Remove follow from db
Follow.prototype.delete = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate("delete");
        if (!this.errors.length) {
            // save followers in DB
            await followsCollection.deleteOne({followedID: this.followedID, authorID: new ObjectID(this.authorID)});
            resolve();
        } else {
            reject(this.errors);
        }
    });
}

Follow.prototype.cleanUp = function() {
    // check if string
    if (typeof(this.followedUsername) != "string") {this.followedUsername = ""}
}

Follow.prototype.validate = async function(action) {
    // followedUsername must exist in db
    let followedAccount = await usersCollection.findOne({username: this.followedUsername});
    if (followedAccount) {
        this.followedID = followedAccount._id;
    } else {
        this.errors.push("You cannot follow a user that does not exist.");
    }

    let doesFollowAlreadyExists = await followsCollection.findOne({followedID: this.followedID, authorID: new ObjectID(this.authorID)});
    if (action == "create") {
        if (doesFollowAlreadyExists) {this.errors.push("You are already following thi user.")}
    }

    if (action == "delete") {
        if (!doesFollowAlreadyExists) {this.errors.push("You cannot stop following someone you do not already follow.")}
    }

    // Not following yourself
    if (this.followedID.equals(this.authorID)) {this.errors.push("You cannot follow youself.")}
}

// Visitor following method
Follow.isVisitorFollowing = async function(followedUserID, visitorID) {
    let followDoc = await followsCollection.findOne({followedID: followedUserID, authorID: new ObjectID(visitorID)});
    return followDoc ? true : false;
}

// Get followers from DB using aggregate
Follow.getFollowersByID = function(id) {
    return new Promise(async (resolve, reject) => {
        try {
            // agregate - array of objects [{}, {}, {}]
            // search followedID by ID,
            // search in users collection by authorID in users _id field as new userDoc
            // return only username and email
            let followers = await followsCollection.aggregate([
                {$match: {followedID: id}},
                {$lookup: {from: "users", localField: "authorID", foreignField: "_id", as: "userDoc"}},
                {$project: {
                    username: {$arrayElemAt: ["$userDoc.username", 0]},
                    email: {$arrayElemAt: ["$userDoc.email", 0]}
                }}
            ]).toArray();
            
            // map new followers array
            followers = followers.map((follower) => {
                // create a user
                let user = new User(follower, true);
                return {username: follower.username, avatar: user.avatar}
            });
            resolve(followers);
        } catch {
            reject();
        }
    });
}

// Get following from DB using aggregate
Follow.getFollowingByID = function(id) {
    return new Promise(async (resolve, reject) => {
        try {
            // agregate - array of objects [{}, {}, {}]
            // search authorID by ID,
            // search in users collection by followID in users _id field as new userDoc
            // return only username and email
            let following = await followsCollection.aggregate([
                {$match: {authorID: id}},
                {$lookup: {from: "users", localField: "followedID", foreignField: "_id", as: "userDoc"}},
                {$project: {
                    username: {$arrayElemAt: ["$userDoc.username", 0]},
                    email: {$arrayElemAt: ["$userDoc.email", 0]}
                }}
            ]).toArray();
            
            // map new followers array
            following = following.map((follower) => {
                // create a user
                let user = new User(follower, true);
                return {username: follower.username, avatar: user.avatar}
            });
            resolve(following);
        } catch {
            reject();
        }
    });
}

// Count follow in DB
Follow.countFollowersByID = function(id) {
    return new Promise(async (resolve, reject) => {
        let followerCount = await followsCollection.countDocuments({followedID: id});
        resolve(followerCount);
    });
}

// Count following in DB
Follow.countFollowingByID = function(id) {
    return new Promise(async (resolve, reject) => {
        let followingCount = await followsCollection.countDocuments({authorID: id});
        resolve(followingCount);
    });
}

module.exports = Follow;