// @datatype_void
module.exports = function (config) {

    var testWebpackConfig = require('./webpack.test.config.js');
    config.set({

        // Base path that will be used to resolve all patterns (e.g. files, exclude)
        basePath: '',

        // Frameworks to use
        // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // List of files to exclude
        exclude: [],

        // List of files / patterns to load in the browser
        // We are building the test environment in ./spec-bundle.js
        files: [{pattern: './config/spec-bundle.js', watched: false}],

        // Pre-process matching files before serving them to the browser
        // Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {'./config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap']},

        // Webpack Config at ./webpack.test.config.js
        webpack: testWebpackConfig,

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                {type: 'text-summary'},
                {type: 'json'},
                {type: 'html'}
            ]
        },

        // Webpack please don't spam the console when running in karma!
        webpackServer: {noInfo: true},

        // Test results reporter to use
        // Possible values: 'dots', 'progress', 'mocha'
        // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        // Web server port
        port: 9876,

        // Enable / disable colors in the output (reporters and logs)
        colors: true,

        // Level of logging
        // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers
        // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            // 'Chrome',
            'PhantomJS'
        ],

        // Continuous Integration mode
        // If true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });

};
