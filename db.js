// Require
const mongodb = require('mongodb');

// Connection params
const connectionString = "";
const databaseName = "SocialApp";

// Connect (3 args) - connectionString, options, callback
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    module.exports = client.db(databaseName);

    // Require express app and start listening
    const app = require("./app");
    app.listen(3000);
});