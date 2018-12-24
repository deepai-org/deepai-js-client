module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/* <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> by DeepAI */\n'
        },

        clean: {
            dist: 'dist/**'
        },

        usebanner: {
            all: {
                options: {
                    banner: '<%= meta.banner %>',
                    linebreak: false
                },
                files: {
                    src: ['dist/*.js']
                }
            }
        },

        eslint: {
            target: ['lib/**/*.js']
        },

        watch: {
            build: {
                files: ['lib/**/*.js'],
                tasks: ['build']
            }
        },

        webpack: require('./webpack.config.js')
    });

    grunt.registerTask('build', 'Run webpack and bundle the source', ['clean', 'webpack']);
};
