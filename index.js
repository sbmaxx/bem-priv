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
});

BEM.create('test').test();
BEM.json('test');