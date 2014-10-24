var microtime = require('microtime');

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

var t1 = microtime.now();
var rnd;
for (var i = 0; i < iterations; i++) {
    rnd = Math.floor(Math.random() * iterations);
    blocks[block + rnd]();
}
var t2 = microtime.now();

var t3 = microtime.now();
var rnd;
for (var i = 0; i < iterations; i++) {
    rnd = Math.floor(Math.random() * iterations);
    BEMPRIV.json(block + rnd);
}
var t4 = microtime.now();

console.log('blocks: ' + (t2 - t1) + ' µs');
console.log('bempriv: '+ (t4 - t3) + ' µs');
