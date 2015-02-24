module.exports = function(grunt) {
  require('time-grunt')(grunt);

  var target = grunt.option('target') || 'dev';

  /* Template für grunt.json (im root Verzeichnis):

    {
      "foswiki": "/opt/qwiki",
      "git": "/opt/git"
    }

   */

  var cfg = {foswiki: '/opt/qwiki', git: '/opt/git'};
  if( grunt.file.exists( 'grunt.json' ) ) {
    try {
      cfg = grunt.file.readJSON( 'grunt.json' );
    } catch ( e ) {
      console.log( 'Invalid file format: grunt.json' );
    }
  }

  var foswikiBase = grunt.option('foswiki') || cfg.foswiki;
  var checkoutBase = grunt.option('git') || cfg.git;

  var pkg = grunt.file.readJSON('package.json');
  var isPlugin = /Plugin$/.test( pkg.name );
  pkg.pubDir = 'pub/System/' + pkg.name;
  pkg.dataDir = 'data/System';
  pkg.libDirBase = 'lib/Foswiki/' + (isPlugin ? 'Plugins/': 'Contrib/');
  pkg.libDir = pkg.libDirBase + pkg.name;

  try {
    var bowerrc = grunt.file.readJSON('.bowerrc');
    pkg.bower = bowerrc.directory;
  } catch( e ) {
    pkg.bower = 'bower_components'
  }

  // foundation components (javascript)
  var fdnScripts = {
    abide: 1,
    accordion: 1,
    alert: 1,
    clearing: 1,
    dropdown: 0,
    equalizer: 1,
    interchange: 1,
    joyride: 1,
    magellan: 1,
    offcanvas: 1,
    orbit: 1,
    reveal: 1,
    slider: 1,
    tab: 1,
    tooltip: 1,
    topbar: 1
  };

  var fdnScriptFiles = function() {
    var base = pkg.bower + '/foundation/js/foundation/';
    var files = [ base + 'foundation.js'];
    for ( var lib in fdnScripts ) {
      if ( fdnScripts.hasOwnProperty( lib ) ) {
        if ( fdnScripts[lib] == 1 ) {
          files.push( base + 'foundation.' + lib + '.js' );
        }
      }
    }

    return files;
  };

  grunt.initConfig({
    pkg: pkg,

    clean: {
      css: ["<%= pkg.pubDir %>/css/*.css"],
      js: ["<%= pkg.pubDir %>/js/*.js", "<%= pkg.pubDir %>/js/addons/*.js"],
      manifest: ["manifest.tmp"]
    },

    copy: {
      manifest: {
        files: [
          {
            src: ['manifest.tmp'],
            dest: '<%= pkg.libDir %>/MANIFEST',
            mode: 0644
          }
        ]
      }
    },

    exec: {
      install: {
        cmd: function() {
          var cmd = [
            'cd ' + foswikiBase,
            './pseudo-install.pl ' + pkg.name
          ];

          return cmd.join( '&&' );
        }
      },
      webfont: {
        cmd: function() {
          var fontcfg = {
            autoHint: true,
            fontBaseName: 'QWikiSymbol',
            inputDir: pkg.pubDir +'/src/fonts/icons',
            dest: pkg.pubDir +'/fonts',
            scssTemplate: pkg.pubDir +'/src/scss/font_tmpl.scss',
            scssDest: pkg.pubDir +'/src/scss/_qwiki-font.scss',
            cssBasePath: '../fonts/',
            cssBaseName: 'icon',
            descent: 0,
            fontHeight: 28.35
          };
          return 'python mkfont.py \''+JSON.stringify(fontcfg).replace(/'/g, '\'\\\'\'')+'\'';
        }
      }
    },

    'file-creator': {
      options: {
        openFlags: 'w'
      },
      'create-manifest-tmp': {
        'manifest.tmp': function( fs, handle, done ) {
          var glob = grunt.file.glob;
          var _ = grunt.util._;

          var ignore = [
            pkg.bower,
            'node_modules/',
            'Gruntfile.js',
            'src/',
            '.git/',
            '.gitignore',
            '.bowerrc',
            '.cache/',
            'build.pl',
            'README.md',
            'MANIFEST',
            'package.json',
            'bower.json',
            'manifest.tmp'
          ];

          glob( '**/*', function ( err, files ) {
            var entries = [];
            _.each( files, function( file ) {
              for ( var i = 0; i < ignore.length; ++i ) {
                if ( file.indexOf( ignore[i] ) > -1 )
                  return;

                if ( grunt.file.isDir( file ) )
                  return;
              }

              entries.push( file );
            });

            entries.push( '' );
            fs.writeSync( handle, entries.join( ' 0644\n' ) );
            done();
          });
        }
      }
    },

    jshint: {
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        // laxbreak: true,
        reporter: require('jshint-stylish'),
        globals: {
          jQuery: true
        },
      },
      beforeconcat: ['<%= pkg.pubDir %>/src/js/**/*.js']
    },

    sass: {
      options: {
          includePaths: ["<%= pkg.bower %>/foundation/scss/", "<%= pkg.bower %>/font-awesome/scss/"]
      },
      dev: {
        options: {
          outputStyle: 'nested',
        },
        files: {
          "<%= pkg.pubDir %>/css/qwiki.css": "<%= pkg.pubDir %>/src/scss/qwiki.scss"
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          "<%= pkg.pubDir %>/css/qwiki.min.css": "<%= pkg.pubDir %>/src/scss/qwiki.scss"
        }
      }
    },

    todo: {
      options: {
        marks: [
          {
            name: 'tbd',
            pattern: /tbd/i,
            color: "orange"
          },{
            name: 'fixme',
            pattern: /fixme/i,
            color: "red"
          },
          {
            name: "todo",
            pattern: /todo/i,
            color: "yellow"
          }
        ],
      },
      src: ['<%= pkg.pubDir %>/src/**/*', '<%= pkg.libDirBase %>/**/*.pm']
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
          '<%= pkg.pubDir %>/js/qwiki.js': [
            '<%= pkg.bower %>/slimScroll/jquery.slimscroll.js',
            '<%= pkg.pubDir %>/src/js/qwiki.js',
            '<%= pkg.pubDir %>/src/js/qwiki/core.js',
            '<%= pkg.pubDir %>/src/js/qwiki/!(core).js'
          ]
        }
      },
      dist: {
        options: {
          compress: {},
          mangle: true,
          preserveComments: false
        },
        files: [{
          '<%= pkg.pubDir %>/js/qwiki.min.js': [
            '<%= pkg.bower %>/slimScroll/jquery.slimscroll.js',
            '<%= pkg.pubDir %>/src/js/qwiki.js',
            '<%= pkg.pubDir %>/src/js/qwiki/core.js',
            '<%= pkg.pubDir %>/src/js/qwiki/!(core).js'
          ],
        }]
      },
      js18n: {
        options: {
          compress: false,
          mangle: false,
          preserveComments: false,
          beautify: true
        },
        files: [{
          expand: true,
          cwd: '<%= pkg.pubDir %>/src/js/i18n',
          src: '**/*.js',
          dest: '<%= pkg.pubDir %>/js/i18n'
        }]
      }
    },

    watch: {
      options: {
        interrupt: true,
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      sass: {
        files: ['<%= pkg.pubDir %>/src/scss/**/*.scss'],
        tasks: ['sass:dev']
      },
      uglify: {
        files: ['<%= pkg.pubDir %>/src/js/**/*.js'],
        tasks: ['jshint','uglify:dev']
      },
      webfont: {
        files: ['<%= pkg.pubDir %>/src/fonts/icons/*.svg', '<%= pkg.pubDir %>/src/scss/font_tmpl.scss'],
        tasks: ['exec:webfont']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-file-creator');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-todo');
  grunt.loadNpmTasks('grunt-webfont');

  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('install', ['clean', 'build', 'manifest', 'pseudo-install']);
  grunt.registerTask('prepare-manifest', ['file-creator:create-manifest-tmp']);
  grunt.registerTask('manifest', ['prepare-manifest', 'copy:manifest', 'clean:manifest']);
  grunt.registerTask('pseudo-install', ['exec:install']);
  grunt.registerTask('build', ['exec:webfont', 'sass', 'jshint', 'uglify' ]);
}
