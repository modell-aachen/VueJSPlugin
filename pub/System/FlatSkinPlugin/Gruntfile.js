module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      css: ["css/*.css"],
      fonts: ["fonts/*"],
      js: ["js/*.js"]
    },

    copy: {
      'font-awesome': {
        files: [
          {
            expand: true,
            cwd: 'bower_components/uikit/dist/fonts/',
            src: '**',
            dest: 'fonts/',
            flatten: true,
            filter: 'isFile',
            mode: 0644
          }
        ]
      },
      'uikit-dev': {
        files: [
          {
            expand: true,
            cwd: 'bower_components/uikit/dist/js/',
            src: ['**/*.js', '!**/*.min.js'],
            dest: 'js/',
            flatten: false,
            filter: 'isFile',
            mode: 0644
          }
        ]
      },
      'uikit-dist': {
        files: [
          {
            expand: true,
            cwd: 'bower_components/uikit/dist/js/',
            src: '**/*.min.js',
            dest: 'js/',
            flatten: false,
            filter: 'isFile',
            mode: 0644
          }
        ]
      }
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

    less: {
      dev: {
        options: {
          ieCompat: true,
          strictImports: true,
          strictUnits: true,
          paths: ["bower_components/uikit/src/less/"]
        },
        files: {
          "css/app.css": "src/less/app.less",
          "css/app-addons.css": "src/less/app-addons.less"
        }
      },
      dist: {
        options: {
          cleancss: true,
          ieCompat: true,
          strictImports: true,
          strictUnits: true,
          paths: ["bower_components/uikit/src/less/"]
        },
        files: {
          "css/app.min.css": "src/less/app.less",
          "css/app-addons.min.css": "src/less/app-addons.less"
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
          'js/fastclick.js': ['bower_components/fastclick/lib/fastclick.js'],
          'js/modernizr.js': ['bower_components/modernizr/modernizr.js'],
          'js/pace.js': ['bower_components/pace/pace.js']
        }
      },
      dist: {
        options: {
          compress: { drop_console: true },
          mangle: true,
          preserveComments: false
        },
        files: {
          'js/app.min.js': ['src/js/**/*.js'],
          'js/fastclick.min.js': ['bower_components/fastclick/lib/fastclick.js'],
          'js/modernizr.min.js': ['bower_components/modernizr/modernizr.js'],
          'js/pace.min.js': ['bower_components/pace/pace.js']
        }
      }
    },

    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less']
      },
      uglify: {
        files: ['src/js/**/*.js'],
        tasks: ['jshint','uglify:dev']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var target = grunt.option('target') || 'dev';
  grunt.registerTask('default', ['build','watch']);
  grunt.registerTask('build', [
    'copy:font-awesome',
    'copy:uikit-' + target,
    'less:' + target,
    'jshint',
    'uglify:' + target]
  );
}
