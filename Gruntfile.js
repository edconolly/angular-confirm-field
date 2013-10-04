/* global module, require */

module.exports = function ( grunt ) {

  grunt.registerTask('build', ['jshint', 'clean:build', 'copy:build', 'less:build', 'html2js']);
  grunt.registerTask('test', ['karma:browser_unit']);
  grunt.registerTask('test:dev', ['karma:headless_unit']);
  grunt.registerTask('package', ['clean:package', 'copy:package', 'useminPrepare', 'concat', 'uglify', 'usemin']);
  grunt.registerTask('compile', ['build', 'package'] );
  grunt.registerTask('workflow:dev', ['connect:dev', 'build', 'open:dev', 'watch:dev']);
  grunt.registerTask('workflow:package', [ 'build', 'open:package', 'connect:package:keepalive']);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-open');

  grunt.initConfig({
    pkg:  grunt.file.readJSON("package.json"),
    env : grunt.option('env') || 'dev',

    app : {
      sourcedir: 'app/src',
      builddir: 'app/build',
      packagedir: 'app/package'
    },

    karma: {
      headless_e2e: {
        options: {
          configFile: 'karma-e2e.conf.js',
          browsers: [ 'PhantomJS' ]
        }
      },
      headless_unit: {
        options: {
          configFile: 'karma-unit.conf.js',
          browsers: [ 'PhantomJS' ]
        }
      },
      browser_e2e: {
        options: {
          configFile: 'karma-e2e.conf.js',
        }
      },
      browser_unit: {
        options: {
          configFile: 'karma-unit.conf.js'
        }
      }
    },

    connect: {
      options: {
        hostname: '*'
      },
      dev: {
        options: {
          port: 9000,
          base: '<%= app.builddir %>',
        }
      },
      package: {
        options: {
          port: 9001,
          base: '<%= app.packagedir %>',
        }
      }
    },

    open: {
      dev: {
        url: 'http://127.0.0.1:<%= connect.dev.options.port %>'
      },
      package: {
        url: 'http://127.0.0.1:<%= connect.package.options.port %>'
      }
    },

    watch: {
      dev: {
        files: ['<%= app.sourcedir %>/**/*'],
        tasks: ['build', 'test:dev'],
        options: {
          livereload: true
        }
      }
    },

    html2js: {
      tempo-confirm-field: {
        options: {
          base: 'app/src/modules'
        },
        src: [ '<%= app.sourcedir %>/modules/**/*.tpl.html' ],
        dest: '<%= app.builddir %>/js/templates.js'
      }
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: '<%= app.sourcedir %>',
            src: ['**', '!css/**'],
            dest: '<%= app.builddir %>'
          }
        ]
      },
      package: {
        files: [
          {
            expand: true,
            cwd: '<%= app.builddir %>',
            src: ['index.html', 'images/**'],
            dest: '<%= app.packagedir %>'
          }
        ]
      }
    },

    less: {
      build: {
        files: [
          {
            expand: true,
            cwd: '<%= app.sourcedir %>',
            src: ['css/**/*.less', 'modules/**/*.less', '!**/*.incl.less'],
            dest: '<%= app.builddir %>',
            ext: '.css'
          }
        ],
        options: {
          paths: ["<%= app.sourcedir %>/css"]
        }
      }
    },

    clean: {
      build : '<%= app.builddir %>',
      package : '<%= app.packagedir %>'
    },

    useminPrepare: {
      html: '<%= app.packagedir %>/index.html',
      options : {
        dest: '<%= app.packagedir %>'
      }
    },
    usemin: {
      html: ['<%= app.packagedir %>/index.html']
    },

    jshint: {
      source: [
        '<%= app.sourcedir %>/**/*.js',
        '!<%= app.sourcedir %>/bower_components/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    }

  });
};
