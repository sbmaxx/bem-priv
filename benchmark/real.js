var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var blocks = require('./real__plain');
var BEM = require('./real__bem');
var objects = require('./real__object');

suite
    .add('BEM-priv', function() {
        BEM.json('page');
    })
    .add('Plain Function', function() {
        blocks['page']();
    })
    .add('Plain Object', function() {
        objects['page'].getBEMJSON();
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
