module.exports = function(grunt) {

  'use strict';

  var serverPort = 9090;
  var liveReload = grunt.option('livereload') != null ? grunt.option('livereload') : true;
  var liveReloadPort = liveReload ? 35730 : false;
  var cordova = grunt.option('cordova') != null ? true : false;
  var targetDir = grunt.option('targetdir') || 'dist';

  var fs = require('fs');

  grunt.initConfig({
    meta: {
      banner: '/* Copyright: Parcmate, LLC */',
      version: '0.1.0'
    },
    dirs: {
      output: targetDir
    },
    clean: ['tmp/*', '<%= dirs.output %>/*'],
    bower_concat: {
      build: {
        dest: '<%= dirs.output %>/js/vendor.js',
        cssDest: '<%= dirs.output %>/css/vendor.css',
        bowerOptions: {
          relative: false
        },
        include: ['jquery', 'lodash', 'angular', 'angular-ui-router', 'angular-local-storage', 'ngCordova'],
        mainFiles: {
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      build: {
        files: {
          '<%= dirs.output %>/js/app.js': ['src/app/app.module.js', 'src/app/app.controller.js'],
          '<%= dirs.output %>/js/sections.js': ['src/app/shared/**/*.js', 'src/app/sections/**/*.js']
        }
      },
    },
    stylus: {
      build: {
        options: {
          paths: ['bower_components/bootstrap-stylus'],
          compress: false
        },
        files: {
          '<%= dirs.output %>/assets/css/main.css': 'src/app/styles/main.styl'
        }
      }
    },
    sass: {
      build: {
        options: {
          style: 'expanded'
        },
        files: {
          'main.css': 'main.scss', 
          'widgets.css': 'widgets.scss'
        }
      }
    },
    jade: {
      build: {
        options: {
          pretty: true,
          data: {
            debug: false,
            liveReload: liveReload,
            liveReloadPort: liveReloadPort,
            cordova: cordova
          }
        },
        files: [{
            '<%= dirs.output %>/index.html': 'src/index.jade'
          }, {
            expand: true,
            cwd: 'src',
            src: ['app/**/*.jade'],
            dest: 'tmp',
            ext: '.html'
          }
        ]
      }
    },
    sync: {
      assets: {
        files: [{
            expand: true,
            cwd: 'src/assets/',
            src: ['fonts/**/*', 'images/**/*', 'js/**/*', 'css/**/*'],
            dest: '<%= dirs.output %>/assets'
        }]
      }
    },
    copy: {
      jade: {
        files: [{
            expand: true,
            flatten: true,
            src: ['tmp/**/*.html'],
            dest: '<%= dirs.output %>/partials'
        }]
      },
    },
    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['default'],
        options: {
          livereload: liveReloadPort
        }
      },
      jade: {
        files: ['src/**/*.jade'],
        tasks: ['jade:build', 'copy:jade'],
        options: {
          livereload: liveReloadPort
        }
      },
      bower: {
        files: ['bower.json'],
        tasks: ['bower_concat:build'],
        options: {
          livereload: liveReloadPort
        }
      },
      js: {
        files: ['src/app/**/*.js'],
        tasks: 'concat:build',
        options: {
          livereload: liveReloadPort
        }
      },
      stylus: {
        files: ['src/app/styles/**/*.styl'],
        tasks: 'stylus:build',
        options: {
          livereload: liveReloadPort
        }
      },
      assets: {
        files: ['src/assets/**/*'],
        tasks: 'sync:assets',
        options: {
          livereload: liveReloadPort
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-sync');

  grunt.registerTask('styles', ['stylus:build']);
  grunt.registerTask('default', ['clean', 'bower_concat:build', 'concat:build', 'jade:build', 'copy', 'sync', 'stylus']);

  var connect = require('connect');
  var serveStatic = require('serve-static');

  return grunt.registerTask('server', 'Start a custom static web server.', function() {
    grunt.log.writeln('Starting static web server in \'targetDir\' on port ' + serverPort);
    
    var server = connect();
    server.use(serveStatic(targetDir, {
      'default': 'index.html'
    }));

    server.listen(serverPort);
    grunt.task.run('default');
    
    return grunt.task.run('watch');
  });

};