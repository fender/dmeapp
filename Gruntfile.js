module.exports = function(grunt) {

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
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     *
     * Any vendor SCSS to be compiled is defined in `src/scss/main.scss`.
     */
    vendor_files: {
      js: [
        // Uncomment the lines below if you want to develop offline.
        // 'vendor/angular/angular.js',
        // 'vendor/angular-route/angular-route.js',
      ],
      assets: []
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
          httpGeneratedImagesPath: '/assets',
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
          httpGeneratedImagesPath: '/assets',
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
          src: ['src/**/*.js']
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
     * This concatenates all of our JS source files into a single file.
     */
    concat: {
      compile_js: {
        options: {
          banner: '<%= banner %>'
        },
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          'src/**/*.js',
          'module.suffix'
        ],
        dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
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
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    /**
     * Watch for changes in style or script files and re-compile as necessary.
     */
    watch: {
      compass: {
        files: ['src/scss/**/*.{scss,sass}'],
        tasks: ['compass:dev']
      },
      js: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'concat:compile_js']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['copy:html']
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

  /**
   * Default tasks.
   */
  grunt.registerTask('default', ['clean', 'jshint', 'compass:dev', 'copy', 'concat', 'watch']);

  /**
   * Production tasks. Same as `default` except we minify JS and SCSS files.
   */
  grunt.registerTask('prod', ['clean', 'jshint', 'compass:prod', 'copy', 'concat', 'uglify']);

};
