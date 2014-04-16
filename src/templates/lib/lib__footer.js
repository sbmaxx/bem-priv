var defineAsGlobal = true;

if(typeof exports === 'object') {
    module.exports = BEM;
    defineAsGlobal = false;
}

if(typeof modules === 'object') {
    modules.define('BEM', function(provide) {
        provide(BEM);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = BEM;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.BEM = BEM);

})(this);
