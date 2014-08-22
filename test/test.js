var expect = require('chai').expect;
var BEMPRIV = require('../');

var plainBench = require('../benchmark/real__plain');
var bemprivBench = require('../benchmark/real__bem');
var objectsBench = require('../benchmark/real__object');
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

    describe('static methods', function() {

        describe('#getName', function() {

            it('should exist', function() {
                expect(BEMPRIV.getName).to.exist;
            });

            it('should return string', function() {
                expect(BEMPRIV.getName()).to.be.a('string');
            });

            it('should return "bem"', function() {
                expect(BEMPRIV.getName()).to.be.equal('bem');
            });

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
                expect(b.getDefaultParams()).to.be.empty;
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
            })
        });

        describe('#mix', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('mix').that.is.a('function');
            })
        });

        describe('#js', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('js').that.is.a('function');
            })
        });

        describe('#tag', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('tag').that.is.a('function');
            })
        });

        describe('#content', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('content').that.is.a('function');
            })
        });

        describe('#prop', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('prop').that.is.a('function');
            });
        });

        describe('#bemjson', function() {
            it('should be a function', function() {
                expect(b).to.have.a.property('bemjson').that.is.a('function');
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

            })
        });

    });

    describe('data checks', function() {
        var b = new BEMPRIV({});
        it('shoud have data', function() {
            expect(b).to.have.a.property('data');
        });
    });

    describe('benchmark tests', function() {

        var plainBemjson = plainBench['page']();
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
