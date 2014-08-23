var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var blocks = require('./real/real__plain');
var BEMPRIV = require('./real/real__bem');
var objects = require('./real/real__object');

suite
    .add('BEMPRIV', function() {
        BEMPRIV.json('page');
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
