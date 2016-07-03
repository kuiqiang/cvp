module.exports = function (mongoose) {
    var gracefulExit = function () {
        mongoose.connection.close(function () {
            console.log("Mongoose connection has disconnected through app termination");

            process.exit(0);
        });
    };

    mongoose.connection.on("connected", function (ref) {
        console.log("Successfully connected to ${process.env.NODE_ENV} database on startup");
    });

    // If the connection throws an error
    mongoose.connection.on("error", function (err) {
        console.error("Failed to connect to ${process.env.NODE_ENV} database on startup", err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log("Mongoose default connection to ${process.env.NODE_ENV} database disconnected");
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

    // Connect to our MongoDB database using the MongoDB connection URI from our predefined environment variable
    mongoose.connect(process.env.MONGO_URI, function (error) {
        if (error) {
            throw error;
        }
    });
};
