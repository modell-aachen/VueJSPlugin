module.exports = function(grunt) {
  grunt.config.set('sass', {
    flat: {
      options: {
        includePaths: [
          'node_modules/foundation-sites/scss',
          'node_modules/open-sans-fontface/sass'
        ],
        outputStlye: 'expanded',
        sourceMap: true
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

  grunt.loadNpmTasks('grunt-sass');
};
