var fs = require('fs');

var blocks = require('./real__plain');
var BEMPRIV = require('./real__bem');
var objects = require('./real__object');

fs.writeFileSync('benchmark/bemjson/plain.json', JSON.stringify(blocks['page'](), null, '    '));
fs.writeFileSync('benchmark/bemjson/bempriv.json', JSON.stringify(BEMPRIV.json('page'), null, '    '));
fs.writeFileSync('benchmark/bemjson/objects.json', JSON.stringify(objects['page'].getBEMJSON(), null, '    '));
