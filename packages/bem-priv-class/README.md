# bem-priv-class

Class for declare block.


## How to use

### Simple Block
```js
const Block = require('bem-priv-class').Block;

class MyBlock extends Block {
    get block() {
        return 'myblock-name';
    }

    json() {
        this.content.push({
            block: 'block2'
        });
    }
}

const myBlock = new MyBlock();
myBlock.json();

result:
{
    block: 'myblock-name',
    content: [{
        block: 'block2'
    }]
}
```

### Set content
```js
const Block = require('bem-priv-class').Block;

class MyBlock extends Block {
    get block() {
        return 'myblock-name';
    }
}

const myBlock = new MyBlock();
myBlock.content.push('test');

result:
{
    block: 'myblock-name',
    content: ['test']
}

```

### Set mods
```js
const Block = require('bem-priv-class').Block;

class MyBlock extends Block {
    get block() {
        return 'myblock-name';
    }
}

const myBlock = new MyBlock();
myBlock.mods = {
    test: true
};

myBlock.mods.modName = 5;

result:
{
    block: 'myblock-name',
    mods: {
        test: true,
        modName: 5
    }
}
```

### Set mix
```js
const Block = require('bem-priv-class').Block;

class MyBlock extends Block {
    get block() {
        return 'myblock-name';
    }
}

const myBlock = new MyBlock();
myBlock.mix.push({
    block: 'mix-block-1'
});

result:
{
    block: 'myblock-name',
    mix: [{
        block: 'mix-block-1'
    }]
}
```

### Set attrs
```js
const Block = require('bem-priv-class').Block;

class MyBlock extends Block {
    get block() {
        return 'myblock-name';
    }
}

const myBlock = new MyBlock();
myBlock.attrs = {
    style: 'color: #000;'
};

result:
{
    block: 'myblock-name',
    attrs: {
        style: 'color: #000;'
    }
}
```

### Set js
```js
const Block = require('bem-priv-class').Block;

class MyBlock extends Block {
    get block() {
        return 'myblock-name';
    }
}

const myBlock = new MyBlock();
myBlock.js.data = [1, 2, 3];

result:
{
    block: 'myblock-name',
    js: {
        data: [1, 2, 3]
    }
}
```

### Add any property to bemjson
```js
const Block = require('bem-priv-class').Block;

class MyBlock extends Block {
    get block() {
        return 'myblock-name';
    }
}

const myBlock = new MyBlock();
myBlock.addProps({
    prop1: 1,
    prop2: 2,
    prop3: 3
});

result:
{
    block: 'myblock-name',
    prop1: 1,
    prop2: 2,
    prop3: 3
}
```

### BlockName decorator
```ts
import { Block, blockName } from 'bem-priv-class';

@blockName('example-block')
class MyBlock extends Block {}

(new MyBlock()).json();

result:
{
    block: 'example-block'
}
```

