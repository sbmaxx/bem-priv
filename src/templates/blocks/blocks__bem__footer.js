Object.keys(BEM).forEach(function(k) {
    if (typeof BEMPRIV[k] === 'undefined') {
        BEMPRIV[k] = BEM[k];
    }
});

BEM = BEMPRIV;

})();
