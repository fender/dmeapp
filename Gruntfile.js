module.exports = function(grunt) {

  var concat_target = grunt.option('offline') ? 'offline' : 'all';
  var modRewrite = require('connect-modrewrite');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /**
     * The `banner` is the comment that is placed at the top of our compiled
     * source files.
     */
    banner: '/*! \n* <%= pkg.title || pkg.name %> - v<%= pkg.version %>' +
            '\n* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> ' +
            '\n* <%= pkg.homepage ? pkg.homepage : "" %> ' +
            '\n*/ \n\n',

    /**
     * `vendor_files` contains patterns that reference vendor code (`vendor/`)
     * that we need to place into the build process. We do this manually as we
     * often do not want to include all vendor provided functionality.
     *
     * The `vendor_files.js` property holds references to vendor scripts to be
     * added to our pages just before the </body> tag. This also merges together
     * with our project app source.
     *
     * The `vendor_files.test_js` property holds references to vendor scripts
     * required for running our Karma unit tests.
     *
     * By default Angular scripts are loaded from the Google CDN and referenced
     * in our index.html. However, if yo uwant to develop offline you can add
     * the command line open `--offline` which will load the vendor files listed
     * in `vendor_files.offline_js`.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     *
     * Any vendor SCSS to be compiled is defined in `src/scss/styles.scss`.
     */
    vendor_files: {
      js: [],
      test_js: [
        'vendor/angular-mocks/angular-mocks.js'
      ],
      offline_js: [
        'vendor/angular/angular.js',
        'vendor/angular-resource/angular-resource.js',
        'vendor/angular-route/angular-route.js',
      ],
      assets: []
    },

    /**
     * These settings make it easier to reference specific file structures of
     * our app.
     */
    app_files: {
      js: [
        'default.config.js',
        'config.js',
        'src/app/**/*.js',
        'tmp/templates.js',
        '!src/app/**/*.spec.js'
      ],
      templates: [
        'src/app/components/**/*.html',
        'src/app/common/**/*.html'
      ],
    },

    /**
     * Empty our dist and tmp directories when `grunt clean` is executed.
     */
    clean: {
      dist: ['dist'],
      tmp: ['tmp']
    },

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts), root HTML files (i.e. index.html)
     * and template HTML files.
     */
    copy: {
      app_assets: {
        files: [
          {
            src: ['**'],
            dest: 'dist/assets/',
            cwd: 'src/assets',
            expand: true
          }
        ]
      },
      vendor_assets: {
        files: [
          {
            src: ['<%= vendor_files.assets %>'],
            dest: 'dist/assets/',
            cwd: '.',
            expand: true,
            flatten: true
          }
        ]
      },
      html: {
        files: [
          {
            src: ['*.html'],
            dest: 'dist/',
            cwd: 'src/app',
            expand: true,
          }
        ]
      },
      templates: {
        files: [
          {
            src: ['<%= app_files.templates %>'],
            dest: 'tmp/',
            expand: true,
            flatten: true,
          }
        ]
      },
    },

    /**
     * We use compass to compile our SCSS files. The `development` environment
     * helps us debug our style whilst `production` minifies the compiled file.
     * Any images that are generated via Compass (e.g. sprites) are output to
     * `src/assets`.
     */
    compass: {
      dev: {
        options: {
          require: ['susy', 'breakpoint'],
          environment: 'development',
          sassDir: 'src/scss',
          cssDir: 'dist/css',
          imagesDir: 'src/scss/sprites',
          generatedImagesDir: 'src/assets',
          httpGeneratedImagesPath: '../assets',
          fontsDir: 'src/assets/fonts',
          httpFontsDir: '../assets/fonts',
        }
      },
      prod: {
        options: {
          require: ['susy', 'breakpoint'],
          environment: 'production',
          sassDir: 'src/scss',
          cssDir: 'dist/css',
          imagesDir: 'src/scss/sprites',
          generatedImagesDir: 'src/assets',
          httpGeneratedImagesPath: '../assets',
          fontsDir: 'src/assets/fonts',
          httpFontsDir: '../assets/fonts',
        }
      },
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check.
     */
    jshint: {
      all: {
        files: {
          src: ['<%= app_files.js %>']
        },
        options: {
          curly: true,
          immed: true,
          newcap: true,
          noarg: true,
          sub: true,
          boss: true,
          eqnull: true,
          strict: false,
          globalstrict: true,
          globals: {
            angular: false
          },
        },
      }
    },

    /**
     * Our Karma configuration.
     */
    karma: {
      options: {
        files: [
          '<%= vendor_files.js %>',
          '<%= vendor_files.offline_js %>',
          '<%= vendor_files.test_js %>',
          'default.config.js',
          'config.js',
          'src/app/**/*.js',
        ],
        browsers: ['phantomjs'],
        frameworks: ['jasmine'],
      },
      dev: {
        reporters: 'dots',
        background: true,
      },
      continuous: {
        singleRun: true,
      },
     },

    /**
     * Combines and minifies our apps HTML templates into a single JS file to be
     *  added to our AngularJS `$templateCache`.
     */
    ngtemplates: {
      dmeApp: {
        cwd: 'tmp',
        src: '*.html',
        dest: 'tmp/templates.js',
        options: {
          htmlmin: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true
          }
        }
      }
    },

    /**
     * This concatenates all of our JS source files into a single file.
     * When the --offline command line parameter is present, the `offline`
     * target is used instead.
     */
    concat: {
      options: {
        banner: '<%= banner %>'
      },
      all: {
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          '<%= app_files.js %>',
          'module.suffix'
        ],
        dest: 'dist/js/dmeapp.js'
      },
      offline: {
        src: [
          '<%= vendor_files.js %>',
          '<%= vendor_files.offline_js %>',
          'module.prefix',
          '<%= app_files.js %>',
          'module.suffix'
        ],
        dest: 'dist/js/dmeapp.js'
      }
    },

    /**
     * When the command line parameter --offline is present, we set the
     * OFFLINE variable to true. We then preprocess our index.html file
     * which can conditionally load external script files.
     */
    preprocess: {
      options: {
        inline: true,
        context: {
          OFFLINE: grunt.option('offline') || false,
          VERSION: 'v<%= pkg.version %>',
        }
      },
      all: {
        src: [
          'dist/index.html',
        ],
      },
    },

    /**
     * Minify our concatenated JS file.
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          '<%= concat.all.dest %>': '<%= concat.all.dest %>'
        }
      }
    },

    /**
     * We use `connect` to host a local server. We add a custom middleware to
     * rewrite any path that does not contain a '.' (period) to /index.html.
     */
    connect: {
      livereload: {
        options: {
          port: 9000,
          hostname: 'localhost',
          base: ['dist/'],
          livereload: true,
          middleware: function(connect, options) {
            var middlewares = [];
            middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]']));
            options.base.forEach(function(base) {
              middlewares.push(connect.static(base));
            });
            return middlewares;
          }
        }
      }
    },

    /**
     * Watch for changes in style or script files and re-compile as necessary.
     */
    watch: {
      options: {
        livereload: true
      },
      compass: {
        files: ['src/**/*.{scss,sass}'],
        tasks: ['compass:dev']
      },
      js: {
        files: ['<%= app_files.js %>'],
        tasks: ['jshint', 'copy:templates', 'ngtemplates', 'concat:' + concat_target, 'clean:tmp']
      },
      html: {
        files: ['src/app/*.html'],
        tasks: ['copy:html', 'preprocess']
      },
      templates: {
        files: ['<%= app_files.templates %>'],
        tasks: ['copy:templates', 'ngtemplates', 'concat:' + concat_target, 'clean:tmp']
      },
      tests: {
        files: ['src/app/**/*.js'],
        tasks: ['karma:dev:run'],
      }
    },
  });

  /**
   * Load our grunt plugins.
   */
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-preprocess');

  /**
   * Default tasks.
   */
  grunt.registerTask('default', ['clean', 'jshint', 'karma:dev', 'compass:dev', 'copy', 'ngtemplates', 'concat:' + concat_target, 'clean:tmp', 'preprocess', 'watch']);

  /**
   * Production tasks. Same as `default` except we minify JS and SCSS files.
   */
  grunt.registerTask('prod', ['clean', 'jshint', 'karma:continuous', 'compass:prod', 'copy', 'ngtemplates', 'concat:all', 'clean:tmp', 'preprocess', 'uglify']);

  /**
   * Running `grunt server` runs our connect server until cancelled.
   */
  grunt.registerTask('server', ['connect:livereload:keepalive']);

  /**
   * Running `grunt test` will run just the Karma unit tests.
   */
  grunt.registerTask('test', ['karma:continuous']);
};
