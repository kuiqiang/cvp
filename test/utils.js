'use strict';

var config = require("../config/config.json");
var mongoose = require("mongoose");

const ENV = 'test';

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = ENV;

var mongoUri = config.MONGO_URI[ENV.toUpperCase()];

beforeEach(function (done) {
    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function (error, status) {
                if (error) {
                    console.error(error);
                }
            });
        }
        return done();
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(mongoUri, function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});

afterEach(function (done) {
    mongoose.disconnect();
    return done();
});
