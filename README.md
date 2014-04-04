bem-priv
========
basic priv.js replacement

```
git clone https://github.com/sbmaxx/bem-priv.git
cd bem-priv
npm install
node index.js
```

[Examples](index.js)


## benchmark's results

[benchmark/real.js](benchmark/real.js)
```
BEM-priv x 31,419 ops/sec ±1.55% (95 runs sampled)
Plain Function x 47,673 ops/sec ±1.08% (94 runs sampled)
Plain Object x 45,147 ops/sec ±1.38% (97 runs sampled)
```
[benchmark/simple.js](benchmark/simple.js)
```
BEM.create x 8,828,972 ops/sec ±0.79% (98 runs sampled)
BEM.static x 62,481,134 ops/sec ±2.31% (85 runs sampled)
BEM.json x 7,546,196 ops/sec ±1.08% (97 runs sampled)
Plain Object x 39,538,348 ops/sec ±1.24% (96 runs sampled)
Plain Function x 69,461,395 ops/sec ±2.72% (85 runs sampled)
```
