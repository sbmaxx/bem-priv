import { safe, safeJson, safeBlock } from '../src/decorators/safe';
import { Block } from '../src/index';
import { assert } from 'chai';

let consoleMock: any;
type Throwable = { throw: boolean };

function createConsoleMock() {
    return {
        calls: 0,
        log(e: Event) {
            this.calls += 1;
        }
    };
}

describe('safe()', () => {
    beforeEach(() => {
        consoleMock = createConsoleMock();
    });

    it('should log error', () => {
        const log = (e: Error) => { consoleMock.log(e); };

        class MyComp extends Block<Throwable, {}> {
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

describe('safeJson()', () => {
    beforeEach(() => {
        consoleMock = createConsoleMock();
    });

    it('should log error', () => {
        const log = (e: Error) => { consoleMock.log(e); };

        @safeJson(log)
        class MyComp extends Block<Throwable, {}> {
            public get defaultParams() {
                return {
                    throw: true
                };
            }

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

    it('should log error if parend was decorate', () => {
        const log = (e: Error) => { consoleMock.log(e); };

        @safeJson(log)
        class MyComp extends Block<Throwable, {}> {
            public get defaultParams() {
                return {
                    throw: true
                };
            }

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

        class ChildComp extends MyComp {
            public json() {
                if (this.params.throw) {
                    throw new Error('Test Error');
                }

                return super.json();
            }
        }

        const childComp = new ChildComp();
        childComp.json();

        assert.strictEqual(consoleMock.calls, 1);
    });
});

describe('safeBlock()', () => {
    beforeEach(() => {
        consoleMock = createConsoleMock();
    });

    it('should log error', () => {
        const log = (e: Error) => { consoleMock.log(e); };

        @safeBlock(log)
        class MyComp extends Block<Throwable, {}> {
            public get defaultParams() {
                return {
                    throw: true
                };
            }

            public test() {
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
            }
        }

        const myComp = new MyComp();
        myComp.test();

        assert.strictEqual(consoleMock.calls, 1);
    });

    it('should log error if parend was decorate', () => {
        const log = (e: Error) => { consoleMock.log(e); };

        @safeBlock(log)
        class MyComp extends Block<Throwable, {}> {
            public get defaultParams() {
                return {
                    throw: true
                };
            }

            public test() {
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

        class ChildComp extends MyComp {
            public test() {
                if (this.params.throw) {
                    throw new Error('Test Error');
                }

                return super.test();
            }
        }

        const childComp = new ChildComp();
        childComp.test();

        assert.strictEqual(consoleMock.calls, 1);
    });
});
