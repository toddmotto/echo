/*
 * Gruntfile.js
 * @author Todd Motto
 * @version 1.0.0
 */

'use strict';

var LIVERELOAD_PORT = 35729;

var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: { name: 'echo' },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [lrSnippet, mountFolder(connect, 'dist')];
          }
        }
      }
    },
    tag: {
      banner: '/*! <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today(\'yyyy\') %> @toddmotto | MIT license | github.com/toddmotto/echo */\n',
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: 'src/<%= project.name %>.js',
    },
    concat: {
      dist: {
        src: ['src/<%= project.name %>.js'],
        dest: 'dist/<%= project.name %>.js'
      },
      options: {
        banner: '<%= tag.banner %>'
      }
    },
    uglify: {
      files: {
        src: ['dist/<%= project.name %>.js'],
        dest: 'dist/<%= project.name %>.min.js'
      },
      options: {
        banner: '<%= tag.banner %>'
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    watch: {
      concat: {
        files: 'src/{,*/}*.js',
        tasks: ['concat:dist', 'uglify']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '{,*/}*.html',
          'dist/{,*/}*.js'
        ]
      }
    }
  });

  grunt.registerTask('default' , [
    'jshint',
    'concat:dist',
    'uglify',
    // 'connect:livereload',
    // 'open',
    // 'watch'
  ]);

};
