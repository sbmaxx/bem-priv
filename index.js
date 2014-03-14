var BEM = require('./bem');

BEM.decl('test', {
    test: function() {
        return 'base "test"';
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