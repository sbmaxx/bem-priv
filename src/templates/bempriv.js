var inherit = (function() {
// include src/inherit.js
@@inherit
return inherit;
})();

(function(global) {
// include src/bempriv.js
@@bempriv

var defineAsGlobal = true;

if(typeof exports === 'object') {
    module.exports = BEMPRIV;
    defineAsGlobal = false;
}

if(typeof modules === 'object') {
    modules.define('BEMPRIV', function(provide) {
        provide(BEMPRIV);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = BEMPRIV;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.BEMPRIV = BEMPRIV);

})(this);
