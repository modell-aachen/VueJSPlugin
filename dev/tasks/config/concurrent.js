module.exports = function(grunt) {
  grunt.config.set('concurrent', {
      dev: [['sass', 'cssmin'], 'uglify']
  });

  grunt.loadNpmTasks('grunt-concurrent');
};
