var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

var BEMPRIV = require('../');
var blocks = {};

// var iterations = 213;
var iterations = 41;

var block = 'block';
for (var i = 0; i < iterations; i++) {
    BEMPRIV.decl(block + i);
    blocks[block + i] = (function(i) {
        return function() {
            return {
                block: block + i
            };
        };
    }(i));
}

suite
    .add('Plain Function', function() {
        var rnd;
        for (var i = 0; i < iterations; i++) {
            rnd = Math.floor(Math.random() * iterations);
            blocks[block + rnd]();
        }
    })
    .add('BEMPRIV', function() {
        var rnd;
        for (var i = 0; i < iterations; i++) {
            rnd = Math.floor(Math.random() * iterations);
            BEMPRIV.json(block + rnd);
        }
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
