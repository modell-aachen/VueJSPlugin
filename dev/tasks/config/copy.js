module.exports = function(grunt) {
  grunt.config.set('copy', {
    opensans: {
      files: [{
        expand: true,
        cwd: 'node_modules/open-sans-fontface/fonts/',
        src: ['**'],
        dest: 'pub/System/FlatSkin/fonts/opensans'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
};
