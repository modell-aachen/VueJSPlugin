module.exports = function(grunt) {
  grunt.config.set('concurrent', {
      dev: [
        ['sass', 'postcss:full', 'postcss:themify', 'cssmin'],
        ['concat:fndt', 'babel:fndt', 'uglify:fndt'],
        'uglify:flat',
        'copy:opensans'
      ]
  });

  grunt.loadNpmTasks('grunt-concurrent');
};
