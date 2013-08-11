/*!
 *  Gruntfile.js configuration
 */

'use strict';

module.exports = function ( grunt ) {

    /*
     * Dynamically load the npm tasks
     */
    require( 'matchdep' ).filterDev('grunt-*').forEach( grunt.loadNpmTasks );

    /*
     * Grunt init
     */
    grunt.initConfig({

        /*
         * Grunt JSON for project
         */
        pkg: grunt.file.readJSON( 'package.json' ),

        /*
         * Credit banner
         */
        tag: {
            banner: "/*!\n" +
                    " *  <%= pkg.title %>\n" +
                    " *  @version <%= pkg.version %>\n" +
                    " *  @author <%= pkg.author[0].name %> <%= pkg.author[1].url %>\n" +
                    " *  Project: <%= pkg.homepage %>\n" +
                    " *\n" +
                    " *  <%= pkg.description %>\n" +
                    " *  Copyright <%= pkg.year %>." +
                    " <%= pkg.licenses[0].type %> licensed.\n" +
                    " */\n"
        },

        /*
         * jsHint
         */
        jshint: {
            files: ["src/echo.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        /*
         * Concat
         */
        concat: {
            dist: {
                src: ["src/echo.js"],
                dest: "dist/echo.js"
            },
            options: {
                banner: "<%= tag.banner %>"
            }
        },

        /*
         * UglifyJS
         */
        uglify: {
            files: {
                src: ["dist/echo.js"],
                dest: "dist/echo.min.js"
            },
            options: {
                banner: "<%= tag.banner %>"
            }
        }

    });

    /*
     * Register tasks
     */
    grunt.registerTask("default", [
        "jshint",
        "concat",
        "uglify"
    ]);

};