module.exports = function(grunt) {
  grunt.registerTask('compile', [
    'clean:dev',
    'concurrent:all',
    'css_wrap:compile'
  ]);
};
