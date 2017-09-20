import { Block } from '../src/index';
import { assert } from 'chai';

describe('bem-priv-class', () => {
    describe('content()', () => {
        it('should return set content', () => {
            class MyComp extends Block {
                constructor() {
                    super();

                    this.content = [{
                        test: 2
                    }];
                }
            }

            const myComp = new MyComp();

            assert.deepEqual(myComp.content[0], { test: 2 });
        });
    });

    describe('mods()', () => {
        it('should return set mods', () => {
            class MyComp extends Block {
                constructor() {
                    super();

                    this.mods = {
                        test: 2
                    };
                }
            }

            const myComp = new MyComp();

            assert.deepEqual(myComp.mods, { test: 2 });
        });
    });

    describe('attrs()', () => {
        it('should return set attrs', () => {
            class MyComp extends Block {
                constructor() {
                    super();

                    this.attrs = {
                        test: 2
                    };
                }
            }

            const myComp = new MyComp();

            assert.deepEqual(myComp.attrs, {test: 2});
        });
    });

    describe('mix()', () => {
        it('should return set mix', () => {
            const mix = [{block: 'a'}, {block: 'b'}];
            const addedMix = { block: '50'};
            const addedMix2 = { block: '60' };

            class MyComp extends Block {
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
    });

    describe('js()', () => {
        it('should return set js params', () => {
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
    });

    describe('json()', () => {
        it('should return correct bemjson', () => {
            class MyComp extends Block {
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

                    return super.json();
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
    });
});
