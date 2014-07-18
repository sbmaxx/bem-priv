var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var BEMPRIV = require('../lib/bempriv');

BEMPRIV.decl('testCreate', {
    getBEMJSON: function() {
        return {
            block: 'test'
        }
    }
});

BEMPRIV.decl('testStatic', {}, {
    getBEMJSON: function() {
        return {
            block: 'test'
        }
    }
});


BEMPRIV.decl('testHelper', {}, {});

var blocks = {};

blocks['object'] = {
    getBEMJSON: function() {
        return {
            block: 'test'
        }
    }
}

blocks['plain'] = function() {
    return {
        block: 'test'
    }
};

// add tests
suite
    .add('BEMPRIV.create', function() {
        BEMPRIV.create('testCreate').getBEMJSON();
    })
    .add('BEMPRIV.static', function() {
        BEMPRIV.blocks['testStatic'].getBEMJSON();
    })
    .add('BEMPRIV.json', function() {
        BEMPRIV.json('testHelper');
    })
    .add('Plain Object', function() {
        blocks['object'].getBEMJSON();
    })
    .add('Plain Function', function() {
        blocks['plain']();
    })

// add listeners
suite
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    });

suite.run();
