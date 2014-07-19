bem-priv
========
Basic priv.js replacement. Features:
* inheritance;
* block's methods;
* fast enough.

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

## how to isntall

```bash
git clone https://github.com/sbmaxx/bem-priv.git
cd bem-priv
npm install
```

[Examples](example.js)

## how to build
* edit `src/bem.js`;
* run `grunt`.

There are two differents version:
* `build/blocks` for PERL's V8 usage;
* `lib` for node.js usage.

## benchmark's results

[benchmark/real.js](benchmark/real.js)
```bash
BEMPRIV-priv x 29,837 ops/sec ±2.39% (92 runs sampled)
Plain Function x 30,551 ops/sec ±1.63% (96 runs sampled)
Plain Object x 29,732 ops/sec ±1.59% (96 runs sampled)
```
[benchmark/simple.js](benchmark/simple.js)
```bash
BEMPRIV.create x 8,828,972 ops/sec ±0.79% (98 runs sampled)
BEMPRIV.static x 62,481,134 ops/sec ±2.31% (85 runs sampled)
BEMPRIV.json x 7,546,196 ops/sec ±1.08% (97 runs sampled)
Plain Object x 39,538,348 ops/sec ±1.24% (96 runs sampled)
Plain Function x 69,461,395 ops/sec ±2.72% (85 runs sampled)
```
