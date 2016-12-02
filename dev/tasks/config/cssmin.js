module.exports = function(grunt) {
  grunt.config.set('cssmin', {
    options: {
      keepSpecialComments: 0,
      sourceMap: true
    },
    dev: {
      files: {
        'pub/System/FlatSkin/css/flatskin.min.css':
          'pub/System/FlatSkin/css/flatskin.css',
        'pub/System/FlatSkin/css/flatskin_wrapped.min.css':
          'pub/System/FlatSkin/css/flatskin_wrapped.css',
        'pub/System/FlatSkin/css/flatskin.colors.min.css':
          'pub/System/FlatSkin/css/flatskin.colors.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
