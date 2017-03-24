module.exports = function(grunt) {
  grunt.config.set('concurrent', {
    options: {
      limit: 4
    },
    all: [
      ['sass', 'postcss:themify', 'concat:modac', 'clean:modac', 'postcss:full', 'cssmin'],
      ['concat:fndt', 'babel:fndt', 'uglify:fndt'],
      ['concat:flat', 'uglify:flat'],
      'copy:opensans'
    ],
    js: [
      ['concat:flat', 'uglify:flat'],
      ['concat:fndt', 'uglify:fndt']
    ]
  });

  grunt.loadNpmTasks('grunt-concurrent');
};
