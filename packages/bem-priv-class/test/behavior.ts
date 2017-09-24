import { Block } from '../src/index';
import { assert } from 'chai';
import { BlockName } from '../src/blockName';

describe('Behavior', () => {
    it('json is return correct bemjson', () => {
        @BlockName('Behavior1')
        class Behavior1 extends Block {
            public json(): object {
                this.mods['behavior1Mods'] = 'yes';
                this.content.push({
                    block: this.block
                });
                return this.bemjson;
            }
        }

        @BlockName('Behavior2')
        class Behavior2 extends Block {
            public json(): object {
                this.content.push({
                    block: this.block
                });

                return this.bemjson;
            }
        }

        class MyComp extends Block {
            public json(): object {
                super.json();

                this.mix = [{ block: 'test' }, { block: 'test2' }];
                this.js = {
                    live: false,
                    data: {
                        testData: 50
                    }
                };

                this.mods['test'] = true;

                return this.bemjson;
            }
        }

        const myComp = new MyComp();
        myComp.addBehavior(new Behavior1());
        myComp.addBehavior(new Behavior2());

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
        });
    })
});
