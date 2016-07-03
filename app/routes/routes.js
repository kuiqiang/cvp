var api = require('./api');

var routes = function (app) {
    // Initialize routes
    api(app);
}

module.exports = routes;