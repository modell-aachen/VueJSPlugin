module.exports = function(grunt) {
  grunt.config.set('sass', {
    dev: {
      options: {
        loadPath: [
          'node_modules/foundation-sites/scss'
        ],
        style: 'expanded',
        trace: true
      },
      files: [{
        expand: true,
        cwd: 'dev/sass/',
        src: ['flatskin.scss'],
        dest: 'pub/System/FlatSkin/css/',
        ext: '.css',
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
};
