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
BEMPRIV x 33,345 ops/sec ±0.63% (99 runs sampled)
Plain Function x 34,075 ops/sec ±0.64% (96 runs sampled)
Plain Object x 32,235 ops/sec ±0.73% (94 runs sampled)
```
[benchmark/simple.js](benchmark/simple.js)
```bash
BEMPRIV.create x 7,859,162 ops/sec ±0.50% (100 runs sampled)
BEMPRIV.static x 73,412,120 ops/sec ±2.38% (87 runs sampled)
BEMPRIV.json x 6,897,213 ops/sec ±0.58% (95 runs sampled)
Plain Object x 47,373,570 ops/sec ±1.30% (96 runs sampled)
Plain Function x 79,107,181 ops/sec ±2.98% (83 runs sampled)
```
