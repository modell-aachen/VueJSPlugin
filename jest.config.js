module.exports = {
    preset: '@modac/jest-config',
    transformIgnorePatterns: [
        '/node_modules/(?!nprogress)',
    ],
    moduleNameMapper: {
        '^vue$': 'vue/dist/vue.js',
    },
};
