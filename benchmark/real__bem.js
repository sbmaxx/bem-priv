var data = require('./elements.json');
var BEM = require('../lib/bem');

BEM.decl('page', {
    getBEMJSON: function() {
        return {
            block: 'page',
            content: [
                BEM.json('header', {
                    showBadge: true
                }),
                BEM.json('content'),
                BEM.json('footer')
            ]
        }
    }
});


BEM.decl('header', {
    getDefaultParams: function() {
        return {
            showBadge: false
        };
    },
    getBEMJSON: function() {
        return {
            block: 'header',
            js: this.getJS(),
            content: this.getContent()
        }
    },
    getJS: function() {
        return false
    },
    getContent: function() {
        return [
            this.getLogo(),
            this.getUser(),
            this.params.showBadge && this.getBadge()
        ]
    },
    getUser: function() {
        return {
            elem: 'user',
            content: BEM.json('user')
        }
    },
    getLogo: function() {
        return {
            elem: 'logo',
            content: 'logo'
        }
    },
    getBadge: function() {
        return '';
    }
});

BEM.decl('user', {
    getBEMJSON: function() {
        return {
            block: 'user',
            content: 'user'
        }
    }
});

BEM.decl('header', {
    getJS: function() {
        return {
            hello: 'world'
        }
    },
    getBadge: function() {
        return {
            elem: 'badge',
            content: 'badge'
        };
    },
    getLogo: function() {
        return {
            elem: 'logo',
            content: {
                tag: 'strong',
                content: 'service logo'
            }
        };
    }
});

BEM.decl('footer', {
    getBEMJSON: function() {
        return {
            block: 'footer',
            content: this.getContent()
        }
    },
    getContent: function() {
        return 'footer';
    }
});

BEM.decl('footer', {
    getContent: function() {
        return {
            elem: 'copyright',
            content: 'copy'
        };
    }
});

BEM.decl('content', {
    getBEMJSON: function() {
        return {
            block: 'content',
            content: BEM.json('items')
        };
    }
});

BEM.decl('items', {
    getDefaultParams: function() {
        return {
            showAtomicNumber: true,
            showAtomicWeight: true,
            showAtomicRadius: false,
            showAtomicVolume: false
        }
    },
    getBEMJSON: function() {

        var self = this,
            params = this.params;

        return {
            block: 'items',
            content: Object.keys(data).map(function(key) {
                return {
                    elem: 'item',
                    content: [
                        {
                            elem: 'symbol',
                            content: self.getSymbol(data[key])
                        },
                        params.showAtomicNumber ? self.getAtomicNumber(data[key]) : '',
                        params.showAtomicWeight ? self.getAtomicWeight(data[key]) : '',
                        params.showAtomicRadius ? self.getAtomicRadius(data[key]) : '',
                        params.showAtomicVolume ? self.getAtomicVolume(data[key]) : ''
                    ]
                };
            })
        };
    },
    getSymbol: function(elem) {
        return elem.symbol;
    },
    getAtomicNumber: function(elem) {
        return elem.atomic_number
    },
    getAtomicWeight: function(elem) {
        return elem.atomic_weight;
    },
    getAtomicRadius: function(elem) {
        return elem['atomic_radius pm'];
    },
    getAtomicVolume: function(elem) {
        return elem['atomic_volume cm3/mol'];
    }
});

module.exports = BEM;
