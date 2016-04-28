module.exports = function(grunt) {
  grunt.config.set('uglify', {
    options: {
      preserveComments: false,
      sourceMap: true
    },
    flat: {
      src: 'pub/System/FlatSkin/js/flatskin.js',
      dest: 'pub/System/FlatSkin/js/flatskin.min.js'
    },
    fndt: {
      src: 'pub/System/FlatSkin/js/foundation.js',
      dest: 'pub/System/FlatSkin/js/foundation.min.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
