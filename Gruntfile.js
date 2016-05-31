module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-bump");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-ng-annotate");
    grunt.loadNpmTasks("grunt-umd");
    grunt.loadNpmTasks("dgeni-alive");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            all: ["Gruntfile.js", "{src,test}/**/*.js", "!src/plural.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        jscs: {
            src: {
                options: {
                    config: ".jscs.json"
                },
                files: {
                    src: ["Gruntfile.js", "{src,test}/**/*.js", "!src/plural.js"]
                }
            }
        },

        concat: {
            dist: {
                files: {
                    "dist/angular-gettext.js": ["src/index.js", "src/*.js"]
                }
            }
        },

        umd: {
            all: {
                options: {
                    src: "dist/angular-gettext.js",
                    deps: {
                        "default": ["angular"]
                    }
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    "dist/angular-gettext.min.js": "dist/angular-gettext.js"
                }
            }
        },

        clean: {
            all: ["dist"]
        },

        watch: {
            options: {
                livereload: true
            },
            all: {
                files: ["src/**.js", "test/*/*"],
                tasks: ["build", "karma:unit:run", "karma:unit_nojquery:run", "karma:e2e:run"]
            },
            unit: {
                files: ["src/**.js", "test/unit/*"],
                tasks: ["build", "karma:unit:run", "karma:unit_nojquery:run"]
            },
            e2e: {
                files: ["src/**.js", "test/{e2e,fixtures}/*"],
                tasks: ["build", "karma:e2e:run"]
            }
        },

        ngAnnotate: {
            dist: {
                files: {
                    "dist/angular-gettext.js": "dist/angular-gettext.js"
                }
            }
        },

        connect: {
            e2e: {
                options: {
                    port: 9000,
                    hostname: "0.0.0.0",
                    middleware: function (connect) {
                        return [
                            // jscs:disable requireDotNotation
                            connect["static"](__dirname)
                        ];
                    }
                }
            }
        },

        karma: {
            unit: {
                configFile: "test/configs/unit.conf.js",
                browsers: ["PhantomJS2"],
                background: true
            },
            unit_nojquery: {
                configFile: "test/configs/unit-nojquery.conf.js",
                browsers: ["PhantomJS2"],
                background: true
            },
            unitci: {
                configFile: "test/configs/unit.conf.js",
                browsers: ["Firefox", "PhantomJS2"],
                singleRun: true,
                reporters: ["dots", "junit"],
                junitReporter: {
                    outputFile: "unit-results.xml"
                }
            },
            unitci_nojquery: {
                configFile: "test/configs/unit-nojquery.conf.js",
                browsers: ["Firefox", "PhantomJS2"],
                singleRun: true,
                reporters: ["dots", "junit"],
                junitReporter: {
                    outputFile: "unit-results.xml"
                }
            },
            e2e: {
                configFile: "test/configs/e2e.conf.js",
                browsers: ["PhantomJS2"],
                background: true
            },
            e2eci: {
                configFile: "test/configs/e2e.conf.js",
                browsers: ["Firefox", "PhantomJS2"],
                singleRun: true,
                reporters: ["dots", "junit"],
                junitReporter: {
                    outputFile: "e2e-results.xml"
                }
            }
        },

        bump: {
            options: {
                files: ["package.json", "bower.json"],
                commitFiles: ["-a"],
                pushTo: "origin"
            }
        },

        "dgeni-alive": {
            options: {
                serve: {
                    port: "10000",
                    openBrowser: true
                }
            },
            api: {
                title: "<%= pkg.title %>",
                version: "<%= pkg.version %>",
                expand: false,
                src: [
                    "src/**/*.js",
                    "docs/**/*.ngdoc"
                ],
                dest: "dist/docs"
            }
        }
    });

    grunt.registerTask("default", ["test"]);
    grunt.registerTask("build", ["clean", "jshint", "jscs", "concat", "umd:all", "ngAnnotate", "uglify"]);
    grunt.registerTask("test", ["build", "connect:e2e", "karma:unit", "karma:unit_nojquery", "karma:e2e", "watch:all"]);
    grunt.registerTask("test_unit", ["build", "karma:unit", "karma:unit_nojquery", "watch:unit"]);
    grunt.registerTask("test_e2e", ["build", "connect:e2e", "karma:e2e", "watch:e2e"]);
    grunt.registerTask("ci", ["build", "karma:unitci", "karma:unitci_nojquery", "connect:e2e", "karma:e2eci"]);
};
