module.exports = function(grunt) {
  grunt.config.set('clean', {
    dev: [
      'pub/System/FlatSkin/css/flatskin.*',
      'pub/System/FlatSkin/js/flatskin.*',
      'pub/System/FlatSkin/js/foundation.*',
      'pub/System/FlatSkin/fonts/opensans/**'
    ],
    modac: [
      'pub/System/FlatSkin/css/modacskin*'
    ]
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};
