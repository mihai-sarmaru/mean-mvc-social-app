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

Follow.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate();
        if (!this.errors.length) {
            // save followers in DB
            await followsCollection.insertOne({followedID: this.followedID, authorID: new ObjectID(this.authorID)});
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

Follow.prototype.validate = async function() {
    // followedUsername must exist in db
    let followedAccount = await usersCollection.findOne({username: this.followedUsername});
    if (followedAccount) {
        this.followedID = followedAccount._id;
    } else {
        this.errors.push("You cannot follow a user that does not exist.");
    }
}

// Visitor following method
Follow.isVisitorFollowing = async function(followedUserID, visitorID) {
    let followDoc = await followsCollection.findOne({followedID: followedUserID, authorID: new ObjectID(visitorID)});
    return followDoc ? true : false;
}

module.exports = Follow;