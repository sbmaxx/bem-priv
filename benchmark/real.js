var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var blocks = require('./real/real__plain');
var BEMPRIV = require('./real/real__bem');
var objects = require('./real/real__object');
var data = require('./data/elements.json');

suite
    .add('BEMPRIV', function() {
        BEMPRIV.json('page');
    })
    .add('BEMPRIV runtime', function() {
        BEMPRIV.createRuntime({}).json('page');
    })
    .add('BEMPRIV light runtime', function() {
        BEMPRIV.createRuntime().json('page');
    })
    .add('BEMPRIV heavy runtime', function() {
        BEMPRIV.createRuntime(data).json('page');
    })
    .add('Plain Function', function() {
        blocks['page'](data);
    })
    .add('Plain Object', function() {
        objects['page'].json();
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
