module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({

        appTitle: "Creative Assembly - TITAN CMS - Server",
        src: "src",
        spec: "spec",
        docs: "docs",
        pkg: grunt.file.readJSON("package.json"),

        notify_hooks: {
            options: {
                enabled: true,
                title: "<%= appTitle %>"
            }
        },

        env: {
            test: {
                NODE_ENV: 'test'
            },
            staging: {
                NODE_ENV: 'staging'
            },			
            prod: {
                NODE_ENV: 'production'
            },
            all: {}
        },

        notify: {
            autobuild: {
                options: {
                    title: "<%= appTitle %> : Autobuild",
                    message: "Complete"
                }
            },
            build: {
                options: {
                    title: "<%= appTitle %> : Build",
                    message: "Complete"
                }
            },
            test: {
                options: {
                    title: "<%= appTitle %> : Test",
                    message: "Finished"
                }
            },
            doc: {
                options: {
                    title: "<%= appTitle %> : Document",
                    message: "Built"
                }
            }
        },

        jshint: {
            all: [
                "<%= src %>/**/*.js",
                "<%= spec %>/**/*.js"
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        jsdoc : {
            dist : {
                src: ["<%= src %>/**/*.js"],
                options: {
                    destination: 'doc'
                }
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'result.txt'
                },
                src: ["<%= spec %>/**/*_spec.js"]
            }
        },

        mocha_istanbul: {
            coverage: {
                src: "<%= spec %>/**/*_spec.js", // a folder works nicely
                options: {
                    excludes: ["<%= spec %>/**/*.js"],
                    mask: '*_spec.js',
                    istanbulOptions: ['--harmony', '--harmony_modules'],
                    mochaOptions: ['--harmony', '--harmony_modules']
                }
            }
        },

        watch: {
            jsFiles: {
                files: ['<%= src %>/**/*.js','<%= spec %>/**/*.js'],
                tasks: ['default', 'notify:autobuild']
            },
            gruntFiles: {
                files: ["Gruntfile.js", "*.json", ".jshintrc"],
                tasks: ['default', 'notify:autobuild'],
                options: {
                    reload: true
                }
            }
        },


        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'dist'
                    ]
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.',
                    dest: 'dist',
                    src: [
                        'config/**/*',
                        'src/**/*',
                        'package.json'
                    ]
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.task.run('notify_hooks');

    grunt.registerTask('validate' , ['jshint:all']);
    grunt.registerTask('test' , ['validate']);
    grunt.registerTask('build' , ['validate' , 'clean:dist', 'copy:dist', 'notify:build']);
    grunt.registerTask('autobuild' , ['default' , 'watch']);
    grunt.registerTask('default' , ['build']);
};