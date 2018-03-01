module.exports = function(grunt) {
  grunt.config.set('sass', {
    flat: {
      options: {
        loadPath: [
          'node_modules/open-sans-fontface/sass',
          'node_modules/foundation-sites/scss',
          'node_modules'
        ],
        trace: false,
        style: 'expanded',
      },
      files: [{
        expand: true,
        cwd: 'dev/sass/',
        src: ['flatskin.scss','flatskin_wrapped.scss','modacskin.scss'],
        dest: 'pub/System/FlatSkin/css/',
        ext: '.css',
      }
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
};
