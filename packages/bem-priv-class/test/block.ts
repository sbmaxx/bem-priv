import { Block } from '../src/block';
import { assert } from 'chai';
import { IBemjson } from '../src/bem';

describe('bem-priv-class', () => {
    describe('content()', () => {
        it('should return set content', () => {
            class MyComp extends Block<{}, { test: string }> {
                public json() {
                    this.content = [{
                        props: { foo: 'bar' }
                    }];

                    return super.json();
                }
            }

            const myComp = new MyComp();

            assert.deepEqual(myComp.json(), {
                    block: 'mycomp',
                    content: [{ props: { foo: 'bar' } }],
                    props: {}
                }
            );
        });
    });

    describe('mods()', () => {
        it('should return set mods', () => {
            class MyComp extends Block<{}, {}> {
                public json() {
                    this.mods = {
                        test: 2
                    };

                    return super.json();
                }
            }

            const myComp = new MyComp();

            assert.deepEqual(myComp.json(), {
                block: 'mycomp',
                mods: { test: 2 },
                props: {}
            });
        });
    });

    describe('attrs()', () => {
        it('should return set attrs', () => {
            class MyComp extends Block<{}, {}> {
                public json() {
                    this.attrs = {
                        test: 2
                    };

                    return super.json();
                }
            }

            const myComp = new MyComp();

            assert.deepEqual(myComp.json(), {
                block: 'mycomp',
                attrs: {test: 2},
                props: {}
            });
        });
    });

    describe('mix()', () => {
        it('should return set mix', () => {
            const mix = [{block: 'a'}, {block: 'b'}];
            const addedMix = { block: '50'};
            const addedMix2 = { block: '60' };

            class MyComp extends Block<{}, {}> {
                public json() {
                    this.mix = mix;

                    this.mix.push(addedMix);
                    this.mix.push(addedMix2);

                    return super.json();
                }
            }

            const myComp = new MyComp();

            assert.deepEqual(myComp.json(), {
                    block: 'mycomp',
                    mix: [{block: 'a'}, {block: 'b'}, {block: '50'}, {block: '60'}],
                    props: {}
                }
            );
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

            class MyComp extends Block<{}, {}> {
                public json() {
                    this.js = js;

                    return super.json();
                }
            }

            const myComp = new MyComp();

            assert.deepEqual(myComp.json(), {
                block: 'mycomp',
                js,
                props: {}
            });
        });
    });

    describe('json()', () => {
        it('should return correct bemjson', () => {
            type Props = {
                prop1: number;
            };

            class MyComp extends Block<{}, Props> {
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

                    this.props = {
                        prop1: 1
                    };

                    return super.json();
                }
            }

            const myComp = new MyComp();

            const json = myComp.json();

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
                props: {
                    prop1: 1
                }
            });
        });
    });
});
