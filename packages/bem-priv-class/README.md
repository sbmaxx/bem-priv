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

        return this.json();
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

    json() {
        this.content.push('test');

        return this.json();
    }
}

const myBlock = new MyBlock();
myBlock.json();

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

    json() {
        this.mods = {
            test: true,
            modName: 5
        };

        return this.json();
    }
}

const myBlock = new MyBlock();
myBlock.json();

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

    json() {
        this.mix.push({
            block: 'mix-block-1'
        });

        return super.json();
    }
}

const myBlock = new MyBlock();
myBlock.json();

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

    json() {
        this.attrs = {
            style: 'color: #000;'
        };

        return super.json();
    }
}

const myBlock = new MyBlock();
myBlock.json();

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

    json() {
        this.js.data = [1, 2, 3];

        return super.json();
    }
}

const myBlock = new MyBlock();
myBlock.json();

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

    json() {
        this.props = {
            prop1: 1,
            prop2: 2,
            prop3: 3
        };

        return super.json();
    }
}
const myBlock = new MyBlock();
myBlock.json();

result:
{
    block: 'myblock-name',
    prop1: 1,
    prop2: 2,
    prop3: 3
}
```

### Modifiers
You can add modifiers to your bemjson as middleware.
```js

class MyComp extends Block {
    json() {
        this.mix = [{ block: 'test' }, { block: 'test2'}];
        this.js = {
            live: false,
            data: {
                testData: this.params
            }
        };
        this.mods = {
            test: true
        };

        return super.json();
    }
}

const renderer = (bemjson, params) => {
    bemjson.mods = bemjson.mods || {};
    bemjson.mods.renderTest = true;
    bemjson.mods.name = params.name;

    return bemjson;
};

const rendererJSON = {
    json(bemjson, params) {
        bemjson.mods = bemjson.mods || {};
        bemjson.mods.renderJSONTest = params.renderJSONTest;
        return bemjson;
    }
};

class Modifier {
    json(bemjson, params) {
        bemjson.mix = bemjson.mix || [];
        bemjson.mix.push({
            block: 'mix',
            js: params
        });

        return bemjson;
    }
}

const modifiers = [renderer, rendererJSON, new Modifier()];

const myComp = new MyComp({
    id: 5,
    name: 'test',
    renderJSONTest: false
});

myComp.modifiers = new Set(modifiers);

myComp.modifiers.add((bemjson)=> {
    bemjson.mods = bemjson.mods || {};
    bemjson.mods.renderTestFromAdd = true;
    bemjson.props = bemjson.props || {};
    bemjson.props.result = 'test!';
    return bemjson;
});

result:
{
    block: 'mycomp',
    mix: [
        { block: 'test' },
        { block: 'test2' },
        {
            block: 'mix',
            js: {
                id: 5,
                name: 'test',
                renderJSONTest: false
            }
        }
    ],
    js: {
        live: false,
        data: {
            testData: {
                id: 5,
                name: 'test'
            }
        }
    },
    mods: {
        test: true,
        renderTest: true,
        renderTestFromAdd: true
    },
    props: {
        result: 'test!'
    }
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

