'use strict';


module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
      php: {
        dist: {
            options: {
                hostname: '127.0.0.1',
                port: 8000,
                base: 'api', // Project root
                keepalive: true,
                open: false
            }
        }
      }
  });

  grunt.registerTask('default', ['php']);
};
