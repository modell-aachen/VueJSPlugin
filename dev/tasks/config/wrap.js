module.exports = function(grunt) {
  	grunt.config.set('css_wrap', {
	    compile: {
		    src: 'pub/System/FlatSkin/css/flatskin.min.css',
		    dest: 'pub/System/FlatSkin/css/flatskin.wrapped.min.css',
		    options: {
		      selector: '.flatskin-wrapped'
		    }
	  	}
	});
  grunt.loadNpmTasks('grunt-css-wrap');
};