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
    },
    jscs: {
      main: [
        'src/bempriv.js',
        'test/test.js'
      ],
      grunt: {
        options: {
          validateIndentation: 2
        },
        files: {
          src: 'Gruntfile.js'
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/bempriv.js', 'test/test.js'],
      options: {
        reporter: require('jshint-stylish')
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'dot'
        },
        src: ['test/test.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['replace']);
  grunt.registerTask('test', ['replace', 'mochaTest', 'jshint', 'jscs']);

};
