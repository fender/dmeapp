module.exports = function(grunt) {

  var concat_target = grunt.option('offline') ? 'offline' : 'all';

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
     * Note that for Angular, we are using the Google CDN which is referenced
     * directly in our index.html. However, if you want to develop offline
     * you can comment that line out and uncomment the angular incluedes below.
     *
     * The `vendor_files.test_js` property holds references to vendor scripts
     * required for running our Karma unit tests.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     *
     * Any vendor SCSS to be compiled is defined in `src/scss/main.scss`.
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
     * `app_files.js` makes it easier to reference our app JS and exclude test
     * spec files.
     */
    app_files: {
      js: ['src/**/*.js', '!src/**/*.spec.js'],
    },

    /**
     * Empty our dist directory when `grunt clean` is executed.
     */
    clean: [
      'dist',
    ],

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and html files.
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
            src: ['**/*.html'],
            dest: 'dist/',
            cwd: 'src',
            expand: true,
            flatten: true
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
          'src/**/*.js',
        ],
        browsers: ['Chrome'],
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
        dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
      },
      offline: {
        src: [
          '<%= vendor_files.js %>',
          '<%= vendor_files.offline_js %>',
          'module.prefix',
          '<%= app_files.js %>',
          'module.suffix'
        ],
        dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    /**
     * When the command line parameter --offline is present, we set the
     * OFFLINE variable to true. We then preprocess our index.html file
     * which can then conditionally load external script files.
     */
    preprocess: {
      options: {
        inline: true,
        context: {
          OFFLINE: grunt.option('offline') || false
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
     * Watch for changes in style or script files and re-compile as necessary.
     */
    watch: {
      compass: {
        files: ['src/**/*.{scss,sass}'],
        tasks: ['compass:dev']
      },
      js: {
        files: ['<%= app_files.js %>'],
        tasks: ['jshint', 'concat:' + concat_target]
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['copy:html']
      },
      tests: {
        files: ['src/**/*.js'],
        tasks: ['karma:dev:run'],
      }
    },
  });

  /**
   * Load our grunt plugins.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-preprocess');

  /**
   * Default tasks.
   */
  grunt.registerTask('default', ['clean', 'jshint', 'karma:dev', 'compass:dev', 'copy', 'concat:' + concat_target, 'preprocess', 'watch']);

  /**
   * Production tasks. Same as `default` except we minify JS and SCSS files.
   */
  grunt.registerTask('prod', ['clean', 'jshint', 'karma:continuous', 'compass:prod', 'copy', 'concat:all', 'preprocess', 'uglify']);

  /**
   * Running `grunt test` will run just the Karma unit tests.
   */
  grunt.registerTask('test', ['karma:continuous']);
};
