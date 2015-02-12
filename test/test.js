var expect = require('chai').expect;
var BEMPRIV = require('../');

var plainBench = require('../benchmark/real/real__plain');
var bemprivBench = require('../benchmark/real/real__bem');
var objectsBench = require('../benchmark/real/real__object');
var baselineBemjson = require('./benchmark.json');

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

    describe('base block', function() {
        BEMPRIV.decl('aa', {
            method: function() {
                return 'a';
            }
        });
        BEMPRIV.decl({ block: 'aa_transform_upper', baseBlock: 'aa' }, {
            method: function() {
                return this.__base().toUpperCase();
            }
        });

        it('should be upppercase', function() {
            var a = BEMPRIV.create('aa_transform_upper');
            expect(a.method()).to.be.equal('A');
        });
    });

    describe('mods', function() {

        BEMPRIV.decl('base', {
            init: function() {
                console.log('init base');
                this.__base();
                this.content('test');
            },
            method: function() {
                return 'method';
            }
        });

        BEMPRIV.decl({ block: 'base', modName: 'foo', modVal: 'baz' }, {
            init: function() {
                this.__base();
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

        it('mods decl should modify bemjson', function() {
            var ref1 = {
                block: 'base',
                mods: {
                    foo: 'baz'
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
            expect(b.bemjson()).to.be.deep.equal(ref1);
            expect(c.bemjson()).to.be.deep.equal(ref2);
        });

    });

    describe('BEMPRIV`s static methods', function() {

        describe('#getName', function() {

            it('should exist', function() {
                expect(BEMPRIV).to.have.a.property('getName').that.is.a('function');
            });

            it('should return string', function() {
                expect(BEMPRIV.getName()).to.be.a('string');
            });

            it('should return "bem"', function() {
                expect(BEMPRIV.getName()).to.be.equal('bem');
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
                expect(b.bemjson().prop).have.to.be.equal('prop');
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
                expect(b.bemjson().foo).have.to.be.equal('bar');
                expect(b.bemjson().bar).have.to.be.equal('baz');
            });
        });

    });

    describe('#getBEMJSON', function() {

        var b;

        beforeEach(function(done) {
            b = new BEMPRIV();
            done();
        });

        it('should be an object', function() {
            expect(b.getBEMJSON()).to.be.a('object');
        });

        it('should have block property', function() {
            var bemjson = b.getBEMJSON();
            expect(bemjson).to.have.a.property('block').that.is.a('string');
            expect(bemjson.block).to.be.equal('bem');
        });

        describe('content', function() {
            it('content should be modifieble', function() {
                b.content({ elem: 'test' });
                expect(b.getBEMJSON()).have.to.be.deep.equal({ block: 'bem', content: { elem: 'test' } });
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

                expect(b.getBEMJSON()).have.to.be.deep.equal(baseline);
                expect(b.bemjson()).have.to.be.deep.equal(baseline);

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

    describe('data checks', function() {
        var b = new BEMPRIV({});
        it('shoud have data', function() {
            expect(b).to.have.a.property('data');
        });
    });

    describe('benchmark tests', function() {

        var plainBemjson = plainBench.page();
        var bemprivBemjson = bemprivBench.json('page');
        var objectsBemjson = objectsBench.page.getBEMJSON();

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
