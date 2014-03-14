var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var BEM = require('./bem');

BEM.decl('testCreate', {
    getBEMJSON: function() {
        return {
            block: 'test'
        }
    }
});

BEM.decl('testStatic', {}, {
    getBEMJSON: function() {
        return {
            block: 'test'
        }
    }
});


BEM.decl('testHelper', {}, {});

var blocks = {};

blocks['test'] = {
    getBEMJSON: function() {
        return {
            block: 'test'
        }
    }
}

// add tests
suite
    .add('BEM.create', function() {
        BEM.create('testCreate').getBEMJSON();
    })
    .add('BEM.static', function() {
        BEM.blocks['testStatic'].getBEMJSON();
    })
    .add('BEM.json', function() {
        BEM.json('testHelper');
    })
    .add('Plain', function() {
        blocks['test'].getBEMJSON();
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
