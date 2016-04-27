module.exports = function(grunt) {
  grunt.config.set('concurrent', {
      dev: [['sass', 'postcss', 'cssmin'], 'uglify']
  });

  grunt.loadNpmTasks('grunt-concurrent');
};
