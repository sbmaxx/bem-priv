var BEM = require('./lib/bem');

BEM.decl('test', {

    _privateMethod: function() {
        return 'private';
    },

    test: function() {
        return 'base ' + this._privateMethod();
    }

});

BEM.decl('test', {

    test: function() {
        console.log(this.__base() + '!');
    }

}, {

    staticMethod: function() {
        return 'hello';
    }

});

var test = BEM.create('test');
test.test();

test.__self.staticMethod();
BEM.blocks['test'].staticMethod();

BEM.json('test'); // { block: 'test' }
