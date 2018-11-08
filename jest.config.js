module.exports = {
    "moduleFileExtensions": [
        "js",
        "json",
        "vue",
        "ts"
    ],
    "transform": {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.tsx?$": "ts-jest"
    },
    "moduleNameMapper": {
        "\\.(css|less)$": "identity-obj-proxy",
        "^vue$": "vue/dist/vue.js"
    },
    "testRegex": "Spec\\.js$",
    "transformIgnorePatterns": [
        "node_modules/(?!(vue-timers)/)"
    ],
    "collectCoverageFrom": [
        "dev/**/*.{js,vue}",
        "!**/node_modules/**"
    ],
    "collectCoverage": true,
    "coverageReporters": ["lcov", "text-summary"],
    "globals": {
        "ts-jest": {
            "diagnostics": {
                "ignoreCodes": [151001]
            }
        },
    }
};
