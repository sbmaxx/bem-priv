var data = require('../data/elements.json');
var Block = require('../../packages/bem-priv-class').Block;

class Page extends Block {
    json() {
        return {
            block: 'page',
            content: [
                (new Header({ showBadge: true })).json(),
                (new Content()).json(),
                (new Footer()).json()
            ]
        }
    }
}


class BaseHeader extends Block {
    get defaultParams() {
        return {
            showBadge: false
        };
    }

    json() {
        return {
            block: 'header',
            js: this.getJS(),
            content: this.getContent()
        }
    }

    getJS() {
        return false;
    }

    getContent() {
        return [
            this.getLogo(),
            this.getUser(),
            this.getBadge()
        ]
    }

    getUser() {
        return {
            elem: 'user',
            content: (new User()).json()
        }
    }

    getLogo() {
        return {
            elem: 'logo',
            content: 'logo'
        }
    }

    getBadge() {
        return {
            elem: 'badge',
            content: 'badge'
        };
    }
}

class User extends Block {
    json() {
        return {
            block: 'user',
            content: 'user'
        }
    }
}

class Header extends BaseHeader {
    getJS() {
        return {
            hello: 'world'
        }
    }

    getLogo() {
        return {
            elem: 'logo',
            content: {
                tag: 'strong',
                content: 'service logo'
            }
        };
    }
}

class BaseFooter extends Block {
    json() {
        return {
            block: 'footer',
            content: this.getContent()
        }
    }

    getContent() {
        return 'footer';
    }
}

class Footer extends BaseFooter {
    getContent() {
        return {
            elem: 'copyright',
            content: 'copy'
        };
    }
}

class Content extends Block {
    json() {
        return {
            block: 'content',
            content: (new Items()).json()
        };
    }
}

class Items extends Block {
    get defaultParams() {
        return {
            showAtomicNumber: true,
            showAtomicWeight: true,
            showAtomicRadius: false,
            showAtomicVolume: false
        }
    }

    json() {
        const params = this.params;
        var showAtomicNumber = params.showAtomicNumber;
        var showAtomicWeight = params.showAtomicWeight;
        var showAtomicRadius = params.showAtomicRadius;
        var showAtomicVolume = params.showAtomicVolume;

        return {
            block: 'items',
            content: Object.keys(data).map((key) => {
                var item = data[key];

                return {
                    elem: 'item',
                    content: [
                        {
                            elem: 'symbol',
                            content: this.getSymbol(item)
                        },
                        showAtomicNumber ? this.getAtomicNumber(item) : '',
                        showAtomicWeight ? this.getAtomicWeight(item) : '',
                        showAtomicRadius ? this.getAtomicRadius(item) : '',
                        showAtomicVolume ? this.getAtomicVolume(item) : ''
                    ]
                };
            })
        };
    }

    getSymbol(elem) {
        return elem.symbol;
    }

    getAtomicNumber(elem) {
        return elem.atomic_number
    }

    getAtomicWeight(elem) {
        return elem.atomic_weight;
    }

    getAtomicRadius(elem) {
        return elem['atomic_radius pm'];
    }

    getAtomicVolume(elem) {
        return elem['atomic_volume cm3/mol'];
    }
};

module.exports = Page;
