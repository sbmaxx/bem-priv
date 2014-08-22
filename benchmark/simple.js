var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var BEMPRIV = require('../');

BEMPRIV.decl('testCreate');

BEMPRIV.decl('testStatic', {}, {
    bemjson: function() {
        return {
            block: 'test'
        }
    }
});

BEMPRIV.decl('testHelper');

var blocks = {};

blocks['object'] = {
    bemjson: function() {
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
        BEMPRIV.create('testCreate').bemjson();
    })
    .add('BEMPRIV.static', function() {
        BEMPRIV.blocks['testStatic'].bemjson();
    })
    .add('BEMPRIV.json', function() {
        BEMPRIV.json('testHelper');
    })
    .add('Plain Object', function() {
        blocks['object'].bemjson();
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
