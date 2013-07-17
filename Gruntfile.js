module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            dest: 'dist/<%= pkg.name %>'
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= pkg.author %> - <%= pkg.license %>\n' +
                    '<%= pkg.homepage %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            'default': {
                src: [
                    'src/<%= pkg.name %>.js'
                ],
                dest: '<%= dirs.dest %>.js'
            }
        },
        umd: {
            'default': {
                src: '<%= dirs.dest %>.js',
                dest: '<%= dirs.dest %>.umd.js',
                objectToExport: 'drag'
            }
        },
        uglify: {
            'default': {
                files: {
                    '<%= dirs.dest %>.min.js': '<%= dirs.dest %>.js',
                    '<%= dirs.dest %>.umd.min.js': '<%= dirs.dest %>.umd.js'
                }
            }
        },
        watch: {
            scripts: {
                files: 'src/**/*.js',
                tasks: ['refresh']
            }
        }
    });

    grunt.registerTask('refresh', ['concat', 'umd', 'uglify']);
    grunt.registerTask('default', ['refresh', 'watch']);

    ['grunt-contrib-concat',
     'grunt-contrib-uglify',
     'grunt-contrib-watch',
     'grunt-umd'
    ].forEach(grunt.loadNpmTasks);
};
