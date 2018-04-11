module.exports = function(grunt) {
  grunt.config.set('concat', {
    options: {
      separator: ';\n',
      sourceMap: true
    },
    fndt: {
      files: {
        'pub/System/FlatSkin/js/foundation.js': [
          'node_modules/foundation-sites/dist/js/foundation.js'
        ]
      }
    },
    flat: {
      files: {
        'pub/System/FlatSkin/js/flatskin.js': [
          'dev/js/**/*.js'
        ]
      }
    },
    modac: {
      files: {
        'pub/System/FlatSkin/css/flatskin.css': [
           'pub/System/FlatSkin/css/modacskin.css',
           'pub/System/FlatSkin/css/flatskin.css'
         ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};
