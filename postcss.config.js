module.exports = {
    plugins: [
        require('postcss-discard-duplicates'),
        require('postcss-discard-empty'),
        require('autoprefixer')({browsers: ['last 2 version']})
    ]
}