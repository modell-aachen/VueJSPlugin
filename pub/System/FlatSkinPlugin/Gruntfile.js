module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      js: ["js/*.js"],
      css: ["css/*.css"],
      fonts: ["fonts/*"],
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/font-awesome/fonts/',
            src: '**',
            dest: 'fonts/',
            flatten: true,
            filter: 'isFile',
            mode: 0644
          }
        ]
      },
    },

    jshint: {
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        reporter: require('jshint-stylish'),
        globals: {
          jQuery: true
        },
      },
      beforeconcat: ['src/js/**/*.js']
    },

    sass: {
      options: {
        includePaths: [
          'bower_components/foundation/scss',
          'bower_components/font-awesome/scss'
        ]
      },
      dev: {
        options: {
          outputStyle: 'nested'
        },
        files: {
          'css/app.css': 'src/scss/app.scss',
          'css/pace.css': 'src/scss/pace.scss'
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/app.min.css': 'src/scss/app.scss',
          'css/pace.min.css': 'src/scss/pace.scss'
        }
      }
    },

    uglify: {
      dev: {
        options: {
          beautify: true,
          compress: false,
          mangle: false,
          preserveComments: 'all'
        },
        files: {
          'js/app.js': ['src/js/**/*.js'],
          'js/foundation.js': ['bower_components/foundation/js/foundation.js'],
          'js/fastclick.js': ['bower_components/fastclick/lib/fastclick.js'],
          'js/modernizr.js': ['bower_components/modernizr/modernizr.js'],
          'js/underscore.js': ['bower_components/underscore/underscore.js'],
          'js/pace.js': ['bower_components/pace/pace.js']
        }
      },
      dist: {
        options: {
          compress: true,
          mangle: true,
          preserveComments: false
        },
        files: {
          'js/app.min.js': [
            'bower_components/modernizr/modernizr.js',
            'bower_components/underscore/underscore.js',
            'bower_components/fastclick/lib/fastclick.js',
            'bower_components/foundation/js/foundation.js',
            'src/js/**/*.js'
          ],
          'js/pace.min.js': ['bower_components/pace/pace.min.js'],
        }
      }
    },

    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass']
      },
      uglify: {
        files: ['src/js/**/*.js'],
        tasks: ['uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  var target = grunt.option('target') || 'dev';
  grunt.registerTask('build', ['copy', 'sass:' + target, 'jshint', 'uglify:' + target]);
  grunt.registerTask('default', ['build','watch']);
}
