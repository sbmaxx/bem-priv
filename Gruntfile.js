module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      bem: {
        src: ['src/templates/lib/lib__header.js', 'src/bem.js', 'src/templates/lib/lib__footer.js'],
        dest: 'lib/bem.js'
      },
      blocksBEM: {
        src: ['src/templates/blocks/blocks__bem__header.js', 'src/bem.js', 'src/templates/blocks/blocks__bem__footer.js'],
        dest: 'blocks/i-bem/i-bem.priv.js'
      },
      blocksInherit: {
        src: ['src/templates/blocks/blocks__inherit__header.js', 'src/inherit.js', 'src/templates/blocks/blocks__inherit__footer.js'],
        dest: 'blocks/i-bem/__inherit/i-bem__inherit.priv.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);

};
