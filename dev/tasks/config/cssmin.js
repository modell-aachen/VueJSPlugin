module.exports = function(grunt) {
  grunt.config.set('cssmin', {
    options: {
      keepSpecialComments: 0
    },
    dev: {
      src: 'pub/System/FlatSkin/css/flatskin.css',
      dest: 'pub/System/FlatSkin/css/flatskin.min.css'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
