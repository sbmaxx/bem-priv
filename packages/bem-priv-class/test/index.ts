import {Block, ComplexBlock} from '../src/index';
import {assert} from 'chai';

describe('bem-priv-class', () => {
    it('mods get and set must work correctly', () => {
        class MyComp extends Block {
            protected get defaultParams(): object {
                return {};
            };

            constructor() {
                super();

                this.mods = {
                    "test": 2
                };
            }
        }

        const myComp = new MyComp();

        assert.strictEqual(myComp.mods['test'], 2);
    });

    it('attrs get and set must work correctly', () => {
        class MyComp extends Block {
            protected get defaultParams(): object {
                return {};
            };

            constructor() {
                super();

                this.attrs = {
                    "test": 2
                };
            }
        }

        const myComp = new MyComp();

        assert.strictEqual(myComp.attrs['test'], 2);
    });

    it('params get and set must work correctly', () => {
        class MyComp extends Block {
            protected get defaultParams(): object {
                return {};
            };

            constructor() {
                super();

                this.js = {
                    "test": 2
                };
            }
        }

        const myComp = new MyComp();

        assert.strictEqual(myComp.js['test'], 2);
    });

    it('content get and set must work correctly', () => {
        class MyComp extends Block {
            protected get defaultParams(): object {
                return {};
            };

            constructor() {
                super();

                this.content = [{
                    "test": 2
                }];
            }
        }

        const myComp = new MyComp();

        assert.strictEqual(myComp.content[0]['test'], 2);
    });

    it('mix get and set must work correctly', () => {
        const mix = [{block: 'a'}, {block: 'b'}];

        class MyComp extends Block {
            protected get defaultParams(): object {
                return {};
            };

            constructor() {
                super();

                this.mix = mix;
            }
        }

        const myComp = new MyComp();

        assert.strictEqual(myComp.mix, mix);
    });

    it('addMods must work correctly', () => {
        class MyComp extends Block {
            protected get defaultParams(): object {
                return {};
            };

            constructor() {
                super();

                this.mods = {
                    test: 2
                };
            }
        }

        const myComp = new MyComp();

        assert.deepEqual(myComp.mods, {test: 2});
    });

    it('addAttrs must work correctly', () => {
        class MyComp extends Block {
            protected get defaultParams(): object {
                return {};
            };

            constructor() {
                super();

                this.attrs = {
                    "test": 2
                };
            }
        }

        const myComp = new MyComp();

        assert.deepEqual(myComp.attrs, {test: 2});
    });

    it('addMix must work correctly', () => {
        const mix = [{block: 'a'}, {block: 'b'}];
        const addedMix = { block: '50'};
        const addedMix2 = { block: '60' };

        class MyComp extends Block {
            protected get defaultParams(): object {
                return {};
            };

            constructor() {
                super();

                this.mix = mix;
            }
        }

        const myComp = new MyComp();

        myComp.mix.push(addedMix);
        myComp.mix.push(addedMix2);

        assert.deepEqual(myComp.mix, [{block: 'a'}, {block: 'b'}, {block: '50'}, {block: '60'}]);
    });

    it('js must work correctly', () => {
        const js = {
            live: false,
            data: {
                testData: 50
            }
        };

        class MyComp extends Block {
            constructor() {
                super();

                this.js = js;
            }
        }

        const myComp = new MyComp();

        assert.deepEqual(myComp.js, js);
    });

    it('json is return correct bemjson', () => {
        class MyComp extends Block {
            protected get defaultParams(): object {
                return {};
            };

            constructor() {
                super();

                this.mix = [{block: 'test'}, {block: 'test2'}];
                this.js = {
                    live: false,
                    data: {
                        testData: 50
                    }
                };
                this.mods = {
                    test: true
                };
            }
        }

        const myComp = new MyComp();

        myComp.addProps({
            prop1: 1,
            prop2: 2,
            prop3: 3
        });

        assert.deepEqual(myComp.json(), {
            block: 'mycomp',
            mix: [{block: 'test'}, {block: 'test2'}],
            js: {
                live: false,
                data: {
                    testData: 50
                }
            },
            mods: {
                test: true
            },
            prop1: 1,
            prop2: 2,
            prop3: 3
        });
    });

    it('createBlock', () => {
        class Block1 extends ComplexBlock {

        }
        class Block2 extends ComplexBlock {
        }
        class Block3 extends ComplexBlock {
        }
        class Block11 extends ComplexBlock {
        }

        class BaseBlock extends ComplexBlock {

            public json() {
                super.json();
                this.js = this.params;

                return this.bemjson;
            }
        }


        class Behavior1 extends Block {
            public json(): object {
                this.mods['behavior1Mods'] = 'yes';
                this.content.push({
                    block: this.block
                });
                return this.bemjson;
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

        assert.deepEqual(json, {
            block: 'baseblock',
            content: [
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
                    content: [
                        {
                            block: 'block11'
                        }
                    ]
                },
                {
                    block: 'block3'
                }
            ],
            js: {}
        });
    });

    it('createBlock inside', () => {
        class Block1 extends ComplexBlock {

        }
        class Block2 extends ComplexBlock {
        }
        class Block3 extends ComplexBlock {
        }
        class Block11 extends ComplexBlock {
        }

        class BaseBlock extends ComplexBlock {

            public json() {
                super.json();
                this.js = this.params;

                this.content = [
                    ComplexBlock.createBlock(
                        Block2,
                        {}
                    ).json(),
                    ComplexBlock.createBlock(
                        Block1,
                        {},
                        ComplexBlock.createBlock(
                            Block11,
                            {}
                        )
                    ).json(),
                    ComplexBlock.createBlock(
                        Block3,
                        {}
                    ).json()
                ];

                return this.bemjson;
            }
        }

        assert.deepEqual(new BaseBlock({}).json(), {
            block: 'baseblock',
            content: [
                {
                    block: 'block2'
                },
                {
                    block: 'block1',
                    content: [
                        {
                            block: 'block11'
                        }
                    ]
                },
                {
                    block: 'block3'
                }
            ],
            js: {}
        });
    });
});
