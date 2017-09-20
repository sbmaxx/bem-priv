bem-priv
========

## how to install

```bash
git clone https://github.com/sbmaxx/bem-priv.git
cd bem-priv
npm install
```

Basic priv.js replacement. Features:
* constructors, mixins, "super" calls and static members via [inherit](https://github.com/dfilatov/inherit);
* fast enough.

## how to build & develop
* edit `src/bempriv.js`;
* run `grunt` & `grunt test`.

There are two differents version:
* `build/blocks` for PERL's V8 usage;
* `build/lib` for node.js usage.

## bempriv vs plain-priv.js

```js
BEMPRIV.decl('block', {
    method: function() {
        return 'hello';
    }
});
BEMPRIV.decl('block', {
    method: function() {
        return this.__base() + ', world';
    }
});
```

vs

```js
blocks['block'] = function(data) {
    return {
        block: 'block'
    };
}
blocks['block__method'] = function(data) {
    return 'hello';
};
(function(base) {
    blocks['blocks__method'] = function(data) {
        return base(data) + ', world';
    }
}(blocks['block__method']));
```

### How to use

First of all you have to declare block
```js
BEMPRIV.decl('foo');
```
And that's enough ;). At that moment you can call:
```js
var f = BEMPRIV.create('foo');
f.bemjson(); // { block: 'foo' }
f.content('bar');
f.bemjson(); // { block: 'foo', content: 'bar' }
```

Or you can add some instances or static methods

```js
BEMPRIV.decl('foo', {
    // instance methods
    // init method is called right after BEMPRIV.create()
    // it's replacement of i-bem's onSetMod: js callback
    init: function() {
        // you can access data & params here
        this.data;
        this.content(this.params);
    },
    getDefaultParams: function() {
        return {
            branch: 'develop'
        };
    }
}, {
    // static
    ANSWER: 42
});

var f = BEMPRIV.create('foo', data, { branch: 'master' });
f.bemjson(); // { block: 'foo', content: { branch: 'master'} }

// this is a shortcut to *.create() && *.bemjson()
BEMPRIV.json('foo', data, { branch: 'release' }); // { block: 'foo', content: { branch: 'release' } }

// access to static props outside of block
BEMPRIV.block('foo').ANSWER


// Mixins
BEMPRIV.decl('html', {
    toHTML: function() {
        return BEMHTML.apply(this.bemjson());
    }
});
BEMPRIV.decl('xml', {
    toXML: function() {
        return '...';
    }
});
BEMPRIV.decl({ block: 'foo', baseMix: ['html', 'xml'] });

var b = BEMPRIV.create('foo');
b.toHTML();
b.toXML();

// Mods
BEMPRIV.decl('car', {
    init: function() {
        this.content('Color: ' + this.getColor());
    },
    getColor: function() {
        return 'black';
    }
});
BEMPRIV.decl({ block: 'car', modName: 'use', modVal: 'taxi' }, {
    getColor: function() {
        return 'yellow';
    }
})
(BEMPRIV.create({ block: 'car', mods: { use: 'taxi' } })).bemjson();
// { block: 'car', content: 'Color: yellow' }
```


## Examples
```js
BEMPRIV.decl('gallery', {
    init: function() {
        this.content({
            elem: 'wrapper',
            content: this.getContent()
        });
    }
});

BEMPRIV.decl({ block: 'specific-gallery', baseBlock: 'gallery' }, {
    getContent: function() {
        return {
            elem: 'project-elem'
        }
    }
});
BEMPRIV.json('specific-gallery'); // { block: 'specific-gallery', content: { elem: 'wrapper', content: { elem: 'project-elem' } } }

BEMPRIV.decl('header', {

    init: function() {

        if (!this.params.isMobile) {
            this.mod('fixed', 'yes');
        }

        this.content({
            block: 'search',
            action: this._getFormAction(),
            content: [
                {
                    elem: 'input',
                    mix: [{
                        block: 'suggest',
                        js: this._getSuggest()
                    }]
                    content: this._getQuery()
                },
                {
                    elem: 'button'
                }
            ]
        });

    },

    _getFormAction: function() {
        return this.params.searchPage;
    },

    _getSuggest: function() {
        return {
            url: this.params.suggestURL,
            version: 2
        };
    },

    _getQuery: function() {
        return this.data.query;
    }

});

// service level
BEMPRIV.decl('header', {
    _getFormAction: function() {
        return [
            this.params.serviceName,
            this.params.searchPage
        ].join('/');
    }
})
```

Also, don't forget to check our [wiki](https://github.com/sbmaxx/bempriv/wiki).

## benchmark's results

[benchmark/real.js](benchmark/real.js)
```bash
BEMPRIV x 32,668 ops/sec ±1.10% (88 runs sampled)
BEMPRIV runtime x 32,537 ops/sec ±0.94% (95 runs sampled)
BEMPRIV light runtime x 32,352 ops/sec ±0.95% (98 runs sampled)
BEMPRIV heavy runtime x 32,454 ops/sec ±1.07% (96 runs sampled)
Plain Function x 33,645 ops/sec ±0.98% (97 runs sampled)
Plain Object x 32,589 ops/sec ±0.98% (98 runs sampled)
```
[benchmark/simple.js](benchmark/simple.js)
```bash
BEMPRIV.create x 11,122,496 ops/sec ±0.38% (100 runs sampled)
BEMPRIV.static x 70,356,474 ops/sec ±2.06% (85 runs sampled)
BEMPRIV.json x 9,297,611 ops/sec ±0.55% (99 runs sampled)
Plain Object x 45,624,589 ops/sec ±1.24% (89 runs sampled)
Plain Function x 73,510,402 ops/sec ±2.97% (85 runs sampled)
```
[benchmark/time2.js](benchmark/time2.js)
```bash
blocks: 172 µs
bempriv: 862 µs
```
Where `µs` — microsecond.

To run benchmark on your own machine — `node benchmark/simple`, `node benchmark/real`.
