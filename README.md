bem-priv
========
Basic priv.js replacement. Features:
* constructors, mixins, "super" calls and static members via [inherit](https://github.com/dfilatov/inherit);
* fast enough.

## how to install

```bash
git clone https://github.com/sbmaxx/bem-priv.git
cd bem-priv
npm install
```

## how to build & develop
* edit `src/bempriv.js`;
* run `grunt`.

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

## Examples
```js
BEMPRIV.decl('header', {
    getBEMJSON: function() {
        return {
            block: 'header',
            content: {
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
            }
        }
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
// service leve
BEMPRIV.decl('header', {
    _getFormAction: function() {
        return [
            this.params.serviceName,
            this.params.searchPage
        ].join('/');
    }
})
```

[Examples](example.js)

## benchmark's results

[benchmark/real.js](benchmark/real.js)
```bash
BEMPRIV x 33,802 ops/sec ±0.79% (92 runs sampled)
Plain Function x 34,251 ops/sec ±0.69% (93 runs sampled)
Plain Object x 33,400 ops/sec ±0.71% (98 runs sampled)
```
[benchmark/simple.js](benchmark/simple.js)
```bash
BEMPRIV.create x 11,122,496 ops/sec ±0.38% (100 runs sampled)
BEMPRIV.static x 70,356,474 ops/sec ±2.06% (85 runs sampled)
BEMPRIV.json x 9,297,611 ops/sec ±0.55% (99 runs sampled)
Plain Object x 45,624,589 ops/sec ±1.24% (89 runs sampled)
Plain Function x 73,510,402 ops/sec ±2.97% (85 runs sampled)
```
