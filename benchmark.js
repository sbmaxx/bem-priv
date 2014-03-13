var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var BEM = require('./bem');

BEM.decl('testCreate', {
    getBEMJSON: function() {
        return {
            block: 'test',
            content: 'hello'
        }
    }
});

BEM.decl('testStatic', {}, {
    getBEMJSON: function() {
        return {
            block: 'test',
            content: 'hello'
        }
    }
});

var blocks = {};
blocks['test'] = function() {
    return {
        block: 'test',
        content: 'hello'
    }
};

// add tests
suite
    .add('BEM.create', function() {
        BEM.create('testCreate').getBEMJSON();
    })
    .add('BEM.static', function() {
        BEM.blocks['testStatic'].getBEMJSON();
    })
    .add('Plain', function() {
        blocks['test']();
    });

// add listeners
suite
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    });

suite.run();