module.exports = function(grunt) {
  grunt.config.set('watch', {
    options: {
      interrupt: true
    },
    grunt: {
      files: ['Gruntfile.js', 'dev/tasks/**/*.js'],
      tasks: ['build']
    },
    sass: {
      files: ['dev/sass/**/*.scss'],
      tasks: ['sass', 'cssmin']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};
