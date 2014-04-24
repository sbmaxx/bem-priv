Object.keys(BEM).forEach(function(k) {
    if (typeof BEMPRIV[k] === 'undefined') {
        BEMPRIV[k] = BEM[k];
    }
});

BEM = BEMPRIV;

})();

// If run within node.js (for testing)
if (typeof exports !== "undefined") {
    exports.BEM = BEM;
}

