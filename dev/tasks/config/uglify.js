module.exports = function(grunt) {
  grunt.config.set('uglify', {
    options: {
      preserveComments: false,
      sourceMap: true
    },
    dev: {
      src: 'pub/System/FlatSkin/js/flatskin.js',
      dest: 'pub/System/FlatSkin/js/flatskin.min.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
