// Require database
const usersCollection = require("../db").db().collection("users");
const followsCollection = require("../db").db().collection("follows");

// Follow object
let Follow = function(followedUsername, authorID) {
    this.followedUsername = followedUsername;
    this.authorID = authorID;
    this.errors = [];
}

Follow.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        await this.validate();
    });
}

Follow.prototype.cleanUp = function() {
    // check if string
    if (typeof(this.followedUsername != "string")) {this.followedUsername = ""}
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

module.exports = Follow;