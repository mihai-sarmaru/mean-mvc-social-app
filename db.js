// Require
const mongodb = require('mongodb');
const dotenv = require('dotenv');

// Load .env file
dotenv.config();

// Connection params
const connectionString = process.env.CONNECTIONSTRING;

// Connect (3 args) - connectionString, options, callback
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    module.exports = client;

    // Require express app and start listening
    const app = require("./app");
    app.listen(process.env.PORT);
});