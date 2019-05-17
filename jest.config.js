module.exports = {
    moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'vue',
        'ts',
        'tsx',
    ],
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!nprogress)',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/dev/$1',
    },
    snapshotSerializers: [
        'jest-serializer-vue',
    ],
    testMatch: [
        '**/frontend-tests/**/*Spec.(js|jsx|ts|tsx)|**/__frontend-tests__/*.(js|jsx|ts|tsx)',
    ],
    testURL: 'http://localhost/',
    coverageReporters: ["lcov", "text-summary"],
    collectCoverageFrom: [
        "dev/**/*.{js,vue}",
        "!**/node_modules/**"
    ],
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
    globals: {
        'ts-jest': {
            babelConfig: true,
        },
    },
};
