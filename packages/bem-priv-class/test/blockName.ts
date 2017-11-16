import { blockName } from '../src/decorators/blockName';
import { Block } from '../src/index';
import { assert } from 'chai';

describe('blockName()', () => {
    it('should set block to json', () => {
        @blockName('component')
        class MyComp extends Block<{}, {}> {
            public json() {

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

                myComp.props = {
                    prop1: 1,
                    prop2: 2,
                    prop3: 3
                };

                return super.json();
            }
        }

        const myComp = new MyComp();

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
