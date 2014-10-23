var data = require('../data/elements.json');

var blocks = {};

blocks['page'] = function() {
    return {
        block: 'page',
        content: [
            blocks['header'](),
            blocks['content'](),
            blocks['footer']()
        ]
    }
};

blocks['header'] = function() {
    return {
        block: 'header',
        content: [
            {
                elem: 'logo',
                content: 'logo'
            },
            {
                elem: 'user',
                content: blocks['user']()
            }
        ]
    }
};

blocks['user'] = function() {
    return {
        block: 'user',
        content: 'user'
    }
};

(function(base) {

    blocks['header'] = function() {

        var block = base();

        // переопределяем JS параметры родительского блока
        block.js = {
            hello: 'world'
        };

        // добавляем в конец массива новый элемент
        block.content.push({
            elem: 'badge',
            content: blocks['header__badge']()
        });

        // удаляем лого
        // вставляем новое лого
        block.content.splice(0, 1, blocks['header__logo']());

        return block;

    };

    blocks['header__badge'] = function() {
        return blocks['header__isBadgeVisible'] ? 'badge' : '';
    };

    blocks['header__logo'] = function() {
        return {
            elem: 'logo',
            content: {
                tag: 'strong',
                content: 'service logo'
            }
        };
    };

    blocks['header__isBadgeVisible'] = function() {
        return true;
    };

}(blocks['header']));

blocks['footer'] = function() {
    return {
        block: 'footer',
        content: 'footer'
    }
};

(function(base) {

    blocks['footer'] = function() {

        var block = base();

        block.content = {
            elem: 'copyright',
            content: 'copy'
        };

        return block;

    };

}(blocks['footer']));


blocks['content'] = function() {
    return {
        block: 'content',
        content: blocks['items']()
    };
};

blocks['items'] = function() {

    return {
        block: 'items',
        content: Object.keys(data).map(function(key) {
            return {
                elem: 'item',
                content: [
                    {
                        elem: 'symbol',
                        content: blocks['items__symbol'](data[key])
                    },
                    blocks['items__showAtomicNumber']() ? blocks['items__atomic-number'](data[key]) : '',
                    blocks['items__showAtomicWeight']() ? blocks['items__atomic-weight'](data[key]) : '',
                    blocks['items__showAtomicRadius']() ? blocks['items__atomic-radius'](data[key]) : '',
                    blocks['items__showAtomicVolume']() ? blocks['items__atoumc-volume'](data[key]) : ''
                ]
            };
        })
    };

};

blocks['items__symbol'] = function(elem) {
    return elem.symbol;
};

blocks['items__showAtomicNumber'] = function() {
    return blocks['items__getParams']().showAtomicNumber;
};
blocks['items__showAtomicWeight'] = function() {
    return blocks['items__getParams']().showAtomicWeight;
};
blocks['items__showAtomicRadius'] = function() {
    return blocks['items__getParams']().showAtomicRadius;
};
blocks['items__showAtomicVolume'] = function() {
    return blocks['items__getParams']().showAtomicVolume;
};

blocks['items__getParams'] = function() {
    return {
        showAtomicNumber: true,
        showAtomicWeight: true,
        showAtomciRadius: false,
        showAtomicVolume: false
    };
};

blocks['items__atomic-number'] = function(elem) {
    return elem.atomic_number;
};
blocks['items__atomic-weight'] = function(elem) {
    return elem.atomic_weight;
};
blocks['items__atomic-radius'] = function(elem) {
    return elem['atomic_radius pm'];
};
blocks['items__atomic-volume'] = function(elem) {
    return elem['atomic_volume cm3/mol'];
};

module.exports = blocks;
