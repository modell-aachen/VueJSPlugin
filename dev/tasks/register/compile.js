module.exports = function(grunt) {
  grunt.registerTask('compile', [
    'clean:dev',
    'concurrent:dev'
  ]);
};
