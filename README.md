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
BEM.create x 18,994,360 ops/sec ±3.13% (87 runs sampled)
BEM.static x 55,539,260 ops/sec ±3.78% (69 runs sampled)
BEM.json x 13,731,055 ops/sec ±2.26% (87 runs sampled)
Plain x 37,507,918 ops/sec ±2.71% (83 runs sampled)
Fastest is BEM.static
```
