// Require database
const usersCollection = require("../db").db().collection("users");
const followsCollection = require("../db").db().collection("follows");
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
}

// Visitor following method
Follow.isVisitorFollowing = async function(followedUserID, visitorID) {
    let followDoc = await followsCollection.findOne({followedID: followedUserID, authorID: new ObjectID(visitorID)});
    return followDoc ? true : false;
}

module.exports = Follow;