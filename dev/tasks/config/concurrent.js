module.exports = function(grunt) {
  grunt.config.set('concurrent', {
      dev: [
        ['sass', 'postcss:full', 'postcss:themify', 'cssmin'],
        'uglify',
        'copy'
      ]
  });

  grunt.loadNpmTasks('grunt-concurrent');
};
