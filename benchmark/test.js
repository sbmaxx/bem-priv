var fs = require('fs');

var blocks = require('./real__plain');
var BEM = require('./real__bem');
var objects = require('./real__object');

fs.writeFileSync('benchmark/example/blocks.json', JSON.stringify(blocks['page'](), null, '    '));
fs.writeFileSync('benchmark/example/bem.json', JSON.stringify(BEM.json('page'), null, '    '));
fs.writeFileSync('benchmark/example/objects.json', JSON.stringify(objects['page'].getBEMJSON(), null, '    '));
