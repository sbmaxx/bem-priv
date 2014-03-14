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


## [benchmark](benchmark.js)'s results

```
BEM.create x 20,826,190 ops/sec ±1.33% (89 runs sampled)
BEM.static x 64,132,163 ops/sec ±2.33% (81 runs sampled)
Plain x 40,980,941 ops/sec ±1.39% (90 runs sampled)
Fastest is BEM.static
```
