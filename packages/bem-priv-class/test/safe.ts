import { safe } from '../src/decorators/safe';
import { Block } from '../src/index';
import { assert } from 'chai';

describe('safe()', () => {
    let consoleMock: any;

    beforeEach(() => {
        consoleMock = {
            calls: 0,
            log(e: Event) {
                this.calls += 1;
            }
        };
    });

    it('LogError', () => {
        const log = (e: Error) => { consoleMock.log(e); };

        class MyComp extends Block<{}> {
            public get defaultParams() {
                return {
                    throw: true
                };
            }

            @safe(log)
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

                if (this.params.throw) {
                    throw new Error('Test Error');
                }

                return super.json();
            }
        }

        const myComp = new MyComp();
        myComp.json();

        assert.strictEqual(consoleMock.calls, 1);
    });
});
