// Karma configuration
// Generated on Mon Oct 17 2016 09:53:01 GMT+0200 (CEST)

let baseConfig = require('./karma.conf.js');

module.exports = function (config) {
    baseConfig(config);
    config.set({
        reporters: ['spec', 'coverage'],

        preprocessors: {
            'dev/**/*.vue': ['coverage'],
        },

        coverageReporter: {
            dir: './reports',
            reporters: [
                {
                    type: 'lcov',
                    subdir: '.'
                },
                {
                    type: 'text-summary'
                }
            ]
        },
        singleRun: true
    });
};
