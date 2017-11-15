import { blockName } from '../src/blockName';
import { Block } from '../src/index';
import { assert } from 'chai';

describe('blockName()', () => {
    it('should set block to json', () => {
        @blockName('component')
        class MyComp extends Block<{}> {
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
            block: 'component',
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
            props: {
                prop1: 1,
                prop2: 2,
                prop3: 3
            }
        });

        assert.strictEqual(myComp.json().block, 'component');
    });
});
