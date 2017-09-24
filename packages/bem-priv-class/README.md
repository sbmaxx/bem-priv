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

### Behavior of Block

```js
class Behavior1 extends Block {
    get block() {
      return 'Behavior1';
    }

    json() {
        this.mods['behavior1Mods'] = 'yes';
        this.content.push({
            block: this.block
        });
        return this._bemjson;
    }
}

class Behavior2 extends Block {
    get block() {
      return 'Behavior2';
    }

    json() {
        this.content.push({
            block: this.block
        });

        return this._bemjson;
    }
}

class MyComp extends Block {
    public json() {
        super.json();

        this.mix = [{ block: 'test' }, { block: 'test2' }];
        this.js = {
            live: false,
            data: {
                testData: 50
            }
        };

        this.mods['test'] = true;

        this.addProps({
            prop1: 1,
            prop2: 2,
            prop3: 3
        });

        return this._bemjson;
    }
}

const myComp = new MyComp();
myComp.addBehavior(new Behavior1());
myComp.addBehavior(new Behavior2());

result:
{
    block: 'mycomp',
    mix: [{block: 'test'}, {block: 'test2'}],
    js: {
        live: false,
        data: {
            testData: 50
        }
    },
    content: [
        {
            block: 'Behavior1'
        },
        {
            block: 'Behavior2'
        }
    ],
    mods: {
        behavior1Mods: 'yes',
        test: true
    },
    prop1: 1,
    prop2: 2,
    prop3: 3
}
```

### Composition of Blocks
You can create a blocks composition using the `addComposition` method of `ComplexBlock` class.
Also you can build tree of block using static method `createBlock` of `ComplexBlock` class.

```js

class Block1 extends ComplexBlock {}
class Block2 extends ComplexBlock {}
class Block3 extends ComplexBlock {}
class Block11 extends ComplexBlock {}

class BaseBlock extends ComplexBlock{

  public json() {
    super.json();
    this.js = this.params;

    return this._bemjson;
  }
}


class Behavior1 extends Block {
  public json(): object {
    this.mods['behavior1Mods'] = 'yes';
    this.content.push({
      block: this.block
    });
    return this._bemjson;
  }
}

const json = ComplexBlock.createBlock(
  BaseBlock,
  {},
    ComplexBlock.createBlock(
        Block2,
        {
          behaviors: [
            new Behavior1()
          ]
        }
    ),
    ComplexBlock.createBlock(
        Block1,
        {},
        ComplexBlock.createBlock(
            Block11,
            {}
        )
    ),
    ComplexBlock.createBlock(
        Block3,
        {}
    )
).json();

result: {
    block: 'baseblock',
    content:[
        {
            block: 'block2',
            content: [{
                  block: 'behavior1'
            }],
            mods: {
              behavior1Mods: 'yes'
            }
        },
        {
            block: 'block1',
            content:[
                {
                    block: 'block11'
                }
            ]},
        {
            block: 'block3'
        }
    ],
    js:{}
}

```

### Mixin

```js
class BemClass extends Block {}

const newClass = mixin(BemClass, {
    test() {
        return 1;
        }
    });

const b = new newClass();

b.test() === 1;

```
