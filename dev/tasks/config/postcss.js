module.exports = function(grunt) {
  grunt.config.set('postcss', {
    options: {
      map: true,
      processors: [
        require('postcss-discard-duplicates')(),
        require('postcss-discard-empty')(),
        require('postcss-zindex')(),
        require('autoprefixer')({browsers: ['last 2 version']}),
        require('postcss-colors-only')
      ]
    },
    dev: {
      src: 'pub/System/FlatSkin/css/flatskin.css',
      dest: 'pub/System/FlatSkin/css/flatskin.colors.css'
    }
  });

  grunt.loadNpmTasks('grunt-postcss');
};
