var inherit = (function() {
// include src/inherit.js
@@inherit
return inherit;
})();

var BEMPRIV = (function() {
// include src/bempriv.js
@@bempriv

// If run within node.js (for testing)
if (typeof exports !== "undefined") {
    exports.BEMPRIV = BEMPRIV;
}

return BEMPRIV;
})();
