var data = require('../data/elements.json');

var blocks = {};

blocks['page'] = {
    bemjson: function() {
        return {
            block: 'page',
            content: [
                blocks['header'].bemjson(),
                blocks['content'].bemjson(),
                blocks['footer'].bemjson()
            ]
        }
    }
};

blocks['header'] = {
    bemjson: function() {
        return {
            block: 'header',
            content: [
                {
                    elem: 'logo',
                    content: 'logo'
                },
                {
                    elem: 'user',
                    content: blocks['user'].bemjson()
                }
            ]
        };
    }
};

blocks['user'] = {
    bemjson: function() {
        return {
            block: 'user',
            content: 'user'
        };
    }
};

(function(base) {

    blocks['header'].bemjson = function() {

        var block = base();

        // переопределяем JS параметры родительского блока
        block.js = {
            hello: 'world'
        };

        // добавляем в конец массива новый элемент
        block.content.push({
            elem: 'badge',
            content: blocks['header'].getBadge()
        });

        // удаляем лого
        block.content.shift();

        // вставляем новое лого
        block.content.unshift(blocks['header'].getLogo());

        return block;

    };

    blocks['header'].getBadge = function() {
        return blocks['header'].isBadgeVisible() ? 'badge' : '';'badge';
    };

    blocks['header'].isBadgeVisible = function() {
        return true;
    };

    blocks['header'].getLogo = function() {
        return {
            elem: 'logo',
            content: {
                tag: 'strong',
                content: 'service logo'
            }
        };
    };

}(blocks['header'].bemjson));

blocks['footer'] = {
    bemjson: function() {
        return {
            block: 'footer',
            content: 'footer'
        };
    }
};

(function(base) {

    blocks['footer'].bemjson = function() {

        var block = base();

        block.content = {
            elem: 'copyright',
            content: 'copy'
        };

        return block;

    };

}(blocks['footer'].bemjson));


blocks['content'] = {
    bemjson: function() {
        return {
            block: 'content',
            content: blocks['items'].bemjson()
        };
    }
};

blocks['items'] = {
    bemjson: function() {

        return {
            block: 'items',
            content: Object.keys(data).map(function(key) {
                return {
                    elem: 'item',
                    content: [
                        {
                            elem: 'symbol',
                            content: blocks['items'].symbol(data[key])
                        },
                        blocks['items'].showAtomicNumber() ? blocks['items__atomic-number'](data[key]) : '',
                        blocks['items'].showAtomicWeight() ? blocks['items__atomic-weight'](data[key]) : '',
                        blocks['items'].showAtomicRadius() ? blocks['items__atomic-radius'](data[key]) : '',
                        blocks['items'].showAtomicVolume() ? blocks['items__atoumc-volume'](data[key]) : ''
                    ]
                };
            })
        };

    }
};

blocks['items'].symbol = function(elem) {
    return elem.symbol;
};

blocks['items'].showAtomicNumber = function() {
    return blocks['items__getParams']().showAtomicNumber;
};
blocks['items'].showAtomicWeight = function() {
    return blocks['items__getParams']().showAtomicWeight;
};
blocks['items'].showAtomicRadius = function() {
    return blocks['items__getParams']().showAtomicRadius;
};
blocks['items'].showAtomicVolume = function() {
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
