var expect = require('chai').expect;
var BEMPRIV = require('../');

var plainBench = require('../../../benchmark/real/real__plain');
var bemprivBench = require('../../../benchmark/real/real__bem');
var objectsBench = require('../../../benchmark/real/real__object');
var baselineBemjson = require('../../../benchmark/baseline/benchmark.json');

describe('BEMPRIV', function() {

    describe('base block', function() {
        BEMPRIV.decl('a', {
            method: function() {
                return 'base';
            }
        });
        BEMPRIV.decl({
            block: 'b',
            baseBlock: 'a'
        });

        var b = BEMPRIV.create('b');

        it('b should have method "method"', function() {
            expect(b).to.have.a.property('method').that.is.a('function');
        });
        it('should return base', function() {
            expect(b.method()).to.be.equal('base');
        });
    });

    describe('mods', function() {

        BEMPRIV.decl('base', {
            init: function() {
                this.__base();
                this.mods({ 'key1': 'value1' });
                this.content('test');
            },
            method: function() {
                return 'method';
            }
        });

        BEMPRIV.decl({ block: 'base', modName: 'foo', modVal: 'baz' }, {
            init: function() {
                this.__base();
                this.mods({ 'key2': 'value2' });
                this.content('foo-baz');
            },
            method: function() {
                return this.__base() + '!';
            }
        });

        BEMPRIV.decl({ block: 'base', modName: 'bar', modVal: 'baz' }, {
            init: function() {
                this.content('bar-baz');
            },
            method: function() {
                return this.__base() + '?';
            }
        });

        var b = BEMPRIV.create('base', null, {
            mods: {
                foo: 'baz'
            }
        });

        var c = BEMPRIV.create({
            block: 'base',
            mods: {
                bar: 'baz'
            }
        });

        it('mods decl should inherit', function() {
            expect(b.method()).to.be.equal('method!');
            expect(c.method()).to.be.equal('method?');
        });

        it('mods should be extended', function() {
            expect(b.mods()).to.be.deep.equal({
                'foo': 'baz',
                'key1': 'value1',
                'key2': 'value2'
            });
        });

        it('mods decl should modify bemjson', function() {
            var ref1 = {
                block: 'base',
                mods: {
                    foo: 'baz',
                    key1: 'value1',
                    key2: 'value2'
                },
                content: 'foo-baz'
            };
            var ref2 = {
                block: 'base',
                mods: {
                    bar: 'baz'
                },
                content: 'bar-baz'
            };
            expect(b.json()).to.be.deep.equal(ref1);
            expect(c.json()).to.be.deep.equal(ref2);
        });

    });

    describe('BEMPRIV`s static methods', function() {

        describe('#getName', function() {

            it('should be a function', function() {
                expect(BEMPRIV).to.have.a.property('getName').that.is.a('function');
            });

            it('should return string', function() {
                expect(BEMPRIV.getName()).to.be.a('string');
            });

            it('should return "bem"', function() {
                expect(BEMPRIV.getName()).to.be.equal('bem');
            });

        });

        describe('#blocks', function() {
            it('should be a functin', function() {
                expect(BEMPRIV).to.have.a.property('blocks').that.is.a('function');
            });

            it('should return object', function() {
                expect(BEMPRIV.blocks()).to.be.a('object');
            });

            it('should contains "a&b" blocks', function() {
                expect(BEMPRIV.blocks()).to.include.keys('a', 'b');
            });
        });

        describe('#create', function() {
            it('should throw human-readable error if constructor doesn\'t exists', function() {
                var msg = '';
                try {
                    BEMPRIV.create('this-block-not-exists');
                } catch (e) {
                    msg = e.message;
                }
                expect(msg).to.be.equal('this-block-not-exists declaration doesn\'t exists.');
            });
        });

    });

    describe('blocks` static methods', function() {

        BEMPRIV.decl('SomeStaticBlock', {}, {
            customStaticMethod: function(val) {
                return val + 1;
            }
        });

        it('should execute static method', function() {
            expect(BEMPRIV.block('SomeStaticBlock').customStaticMethod(1))
                .to.be.equal(2);
        });

    });

    describe('mixins', function() {
        BEMPRIV.decl('foo', {
            foo: function() {
                return 'foo';
            }
        });
        BEMPRIV.decl('baz', {
            baz: function() {
                return 'baz';
            }
        });
        BEMPRIV.decl({ block: 'foobaz', baseMix: ['foo', 'baz'] }, {
            foobaz: function() {
                return this.foo() + this.baz();
            }
        });
        it('should have mix', function() {
            var b = BEMPRIV.create('foobaz');
            expect(b).to.have.a.property('foo').that.is.a('function');
            expect(b).to.have.a.property('baz').that.is.a('function');
            expect(b).to.have.a.property('foobaz').that.is.a('function');
            expect(b.foobaz()).to.have.be.equal('foobaz');
        });
    });

    describe('instance methods', function() {

        var b;

        beforeEach(function(done) {
            b = new BEMPRIV();
            done();
        });

        describe('#getDefaultParams', function() {

            it('should exists', function() {
                expect(b).to.have.a.property('getDefaultParams').that.is.a('function');
            });

            it('default params should be an object', function() {
                expect(b.getDefaultParams()).to.be.a('object');
            });

            it('default params should be an empty object', function() {
                expect(b.getDefaultParams()).to.be.deep.equal({});
            });

        });

        describe('#mod', function() {
            it('should exists', function() {
                expect(b).to.have.a.property('mod').that.is.a('function');
            });
            it('setter should be chainable', function() {
                expect(b.mod('key', '')).to.be.equal(b);
            });
            it('setter values', function() {
                expect(b.mod('key', 'value').mod('key')).to.be.equal('value');
                expect(b.mod('key', 5).mod('key')).to.be.equal(5);
            });
        });

        describe('#mods', function() {
            it('should exist', function() {
                expect(b).to.have.a.property('mods').that.is.a('function');
            });
            it('setter values', function() {
                expect(b.mods({ key: 'value' }).mods()).to.be.deep.equal({ key: 'value' });
            });
        });

        describe('#attr', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('attr').that.is.a('function');
            });
            it('setter should be chainable', function() {
                expect(b.attr('key', 'value')).have.to.be.equal(b);
            });
            it('setter/getter', function() {
                expect(b.attr('key', 'value').attr('key')).have.to.be.equal('value');
            });
        });

        describe('#attrs', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('attrs').that.is.a('function');
            });
            it('setter/getter', function() {
                var test = { key: 'value' };
                expect(b.attrs(test).attrs()).have.to.be.deep.equal(test);
            });
        });

        describe('#cls', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('cls').that.is.a('function');
            });
        });

        describe('#mix', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('mix').that.is.a('function');
            });
        });

        describe('#js', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('js').that.is.a('function');
            });
            it('should be empty with no params', function() {
                expect(b.js()).have.to.be.equal(undefined);
            });
        });

        describe('#tag', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('tag').that.is.a('function');
            });
        });

        describe('#content', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('content').that.is.a('function');
            });
        });

        describe('#prop', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('prop').that.is.a('function');
            });
        });

        describe('#props', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('props').that.is.a('function');
            });
            it('should set a property', function() {
                b.prop('prop', 'prop');
                expect(b.json().prop).have.to.be.equal('prop');
            });
        });

        describe('#bemjson', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('props').that.is.a('function');
            });
            it('should set a properties', function() {
                b.props({
                    foo: 'bar',
                    bar: 'baz'
                });
                expect(b.json().foo).have.to.be.equal('bar');
                expect(b.json().bar).have.to.be.equal('baz');
            });
        });

    });

    describe('#bemjson', function() {

        var b;

        beforeEach(function(done) {
            b = new BEMPRIV();
            done();
        });

        it('should be an object', function() {
            expect(b.json()).to.be.a('object');
        });

        it('should have block property', function() {
            var bemjson = b.json();
            expect(bemjson).to.have.a.property('block').that.is.a('string');
            expect(bemjson.block).to.be.equal('bem');
        });

        describe('content', function() {
            it('content should be modifieble', function() {
                b.content({ elem: 'test' });
                expect(b.json()).have.to.be.deep.equal({ block: 'bem', content: { elem: 'test' } });
            });

            it('bemjson integration', function() {

                var baseline = {
                    block: 'bem',
                    mix: [{ block: 'foo' }, { block: 'bar' }],
                    content: {
                        elem: 'test'
                    },
                    mods: {
                        key: 'value'
                    },
                    js: true,
                    tag: 'span',
                    prop: 'value'
                };

                b
                    .content({ elem: 'test' })
                    .mod('key', 'value')
                    .js(true)
                    .tag('span')
                    .prop('prop', 'value')
                    .mix([{ block: 'foo' }])
                    .mix({ block: 'bar' });

                expect(b.json()).have.to.be.deep.equal(baseline);
                expect(b.json()).have.to.be.deep.equal(baseline);

            });

            it('should return empty block', function() {
                BEMPRIV.decl('empty', {
                    init: function() {
                        if (!this.data.smth) {
                            return '';
                        }
                    }
                });
                expect(BEMPRIV.json('empty', {
                    smth: false
                })).have.to.be.equal('');
            });

            it('empty block & modifiers', function() {

                BEMPRIV.decl({

                    block: 'direct',
                    modName: 'serp-list',
                    modVal: 'yes'

                }, {

                    init: function() {
                        return '';
                    },

                    test: function() {
                        return 'hello';
                    }

                });

                var priv = BEMPRIV.create({ block: 'direct', mods: { 'serp-list': 'yes' } });
                expect(priv.test()).have.to.be.equal('hello');

            });
        });

    });

    describe('final methods', function() {
        BEMPRIV.decl('BlockWithFinalMethods', {
            method: function() {
                'final';
                return 'hello';
            }
        });
        BEMPRIV.decl('BlockWithFinalMethods', {
            method: function() {
                return this.__base() + ', World!';
            }
        });
        var b = BEMPRIV.create('BlockWithFinalMethods');
        it('should not be extended', function() {
            expect(b.method()).to.be.equal('hello');
        });
    });

    describe('mock base', function() {
        BEMPRIV.decl('mock-base', {
            method: function() {
                return 'hello';
            }
        });
        BEMPRIV.decl('mock-base', {
            method: function() {
                return this.__base() + ', World!';
            }
        });
        var a = BEMPRIV.create('mock-base');
        a.method.__base = function() {
            return 'Hey';
        };
        it('should be mocked', function() {
            expect(a.method()).to.be.equal('Hey, World!');
        });
        var b = BEMPRIV.create('mock-base');
        BEMPRIV.block('mock-base').prototype.method.__base = function() {
            return 'Hey';
        };
        it('should be mocked via prototype', function() {
            expect(b.method()).to.be.equal('Hey, World!');
        });
    });

    describe('try/catch', function() {
        BEMPRIV.decl('BlockWithWrongConstructor', {
            __constructor: function() {
                asdf; // jshint ignore:line
            }
        });

        BEMPRIV.decl('BlockWithHelloConstructor', {
            __constructor: function() {
                hello; // jshint ignore:line
            }
        });

        it('should catch errors', function() {
            var error = false;
            try {
                BEMPRIV.create('BlockWithWrongConstructor');
            } catch (e) {
                error = true;
            }
            expect(error).to.be.equal(true);
        });

        describe('wrapped', function() {
            var error;

            var onError = function(e) {
                error = e;
                if (e.message === 'hello is not defined') {
                    return 'hello :(';
                }
            };

            before(function() {
                BEMPRIV.wrapTryCatch(onError);
            });

            it('should not catch errors', function() {
                var error = false;
                try {
                    BEMPRIV.create('BlockWithWrongConstructor');
                } catch (e) {
                    error = true;
                }
                expect(error).to.be.equal(false);
            });

            it('should wrap only once', function() {
                var wrapped = BEMPRIV.create.toString();
                BEMPRIV.wrapTryCatch();
                expect(wrapped).to.be.equal(BEMPRIV.create.toString());
            });

            it('#json of wrappedBlock should return empty string', function() {
                // blocks are already wrapped
                expect(BEMPRIV.json('BlockWithWrongConstructor')).to.be.equal('');
            });

            it('should call custom onError handler', function() {
                BEMPRIV.json('BlockWithWrongConstructor');
                expect(error.message).to.be.equal('asdf is not defined');
            });

            it('onError can return smth in case of error', function() {
                expect(BEMPRIV.json('BlockWithHelloConstructor')).to.be.equal('hello :(');
            });
        });
    });

    describe('benchmark tests', function() {
        var plainBemjson = plainBench.page();
        var bemprivBemjson = bemprivBench.json('page');
        var objectsBemjson = objectsBench.page.bemjson();

        it('BEMPRIV\'s bemjson should be equal to baseline', function() {
            expect(bemprivBemjson).have.to.be.deep.equal(baselineBemjson);
        });

        it('object\'s bemjson should be equal to baseline', function() {
            expect(objectsBemjson).have.to.be.deep.equal(baselineBemjson);
        });

        it('plains\'s bemjson should be equal to baseline', function() {
            expect(plainBemjson).have.to.be.deep.equal(baselineBemjson);
        });
    });
});
