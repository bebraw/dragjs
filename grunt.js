/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.3.8',
      banner: '/*! drag.js - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://bebraw.github.com/drag.js/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Juho Vepsalainen; Licensed MIT */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>',
              'src/drag.js'],
        dest: 'dist/drag.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/drag.min.js'
      }
    },
    watch: {
      files: 'src/**/*.js',
      tasks: 'concat min'
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat min');

};
