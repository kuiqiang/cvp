require("core-js/es6");
require("core-js/es7/reflect");
require("zone.js/dist/zone");

// Typescript "emit helpers" polyfill
require("ts-helpers");

if ("production" === ENV) {
    // Production
} else {
    Error.stackTraceLimit = Infinity;

    require("zone.js/dist/long-stack-trace-zone");
}
