var BEM = require('./bem');

BEM.decl('test', {
    test: function() {
        return 'a';
    }
});

BEM.decl('test', {
    test: function() {
        return this.__base() + 'b';
    }
});

BEM.decl({ block: 'test_test', baseBlock: 'test' }, {
    test: function() {
        return 'test' + this.__base();
    }
});


console.log((new B).test());
console.log(BEM.create('test_test').test());