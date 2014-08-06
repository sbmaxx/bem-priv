module.exports = function(grunt) {

  grunt.initConfig({
    replace: {
      node: {
        options: {
          patterns: [{
            match: 'bempriv',
            replacement: '<%= grunt.file.read("src/bempriv.js") %>'
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: 'src/templates/bempriv.js',
          dest: 'build/lib/'
        }]
      },
      block: {
        options: {
          patterns: [{
            match: 'bempriv',
            replacement: '<%= grunt.file.read("src/bempriv.js") %>'
          }, {
            match: 'inherit',
            replacement: '<%= grunt.file.read("src/inherit.js") %>'
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: 'src/templates/i-bem.priv.js',
          dest: 'build/blocks/i-bem/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('default', ['replace']);

};
