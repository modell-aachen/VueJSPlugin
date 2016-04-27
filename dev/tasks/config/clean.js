module.exports = function(grunt) {
  grunt.config.set('clean', {
    dev: [
      'pub/System/FlatSkin/css/flatskin.*',
      'pub/System/FlatSkin/js/flatskin.*',
      'pub/System/FlatSkin/fonts/opensans/**'
    ]
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};
