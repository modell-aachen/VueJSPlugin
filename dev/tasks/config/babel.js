module.exports = function(grunt) {
  grunt.config.set('babel', {
    options: {
      sourceMap: true,
      presets: ['es2015']
    },
    fndt: {
      files: {
        'pub/System/FlatSkin/js/foundation.js':
          'pub/System/FlatSkin/js/foundation.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
};



