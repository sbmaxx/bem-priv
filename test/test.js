var expect = require('chai').expect;
var BEM = require('../lib/bem');

describe('BEM', function() {

    describe('base block', function() {
        BEM.decl('a', {
            method: function() {
                return 'base';
            }
        });
        BEM.decl({
            block: 'b',
            baseBlock: 'a'
        });

        var b = BEM.create('b');

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
                expect(BEM.getName).to.exist;
            });

            it('should return string', function() {
                expect(BEM.getName()).to.be.a('string');
            });

            it('should return "bem"', function() {
                expect(BEM.getName()).to.be.equal('bem');
            });

        });

    });

    describe('instance methods', function() {

        var b;

        beforeEach(function(done) {
            b = new BEM();
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

    });

    describe('#getBEMJSON', function() {

        var b;

        beforeEach(function(done) {
            b = new BEM();
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

                b
                    .content({ elem: 'test' })
                    .mod('key', 'value')
                    .js(true)
                    .tag('span')
                    .mix([{ block: 'another-block' }]);

                expect(b.getBEMJSON()).have.to.be.deep.equal({
                    block: 'bem',
                    mix: [{ block: 'another-block' }],
                    content: {
                        elem: 'test'
                    },
                    mods: {
                        key: 'value'
                    },
                    js: true,
                    tag: 'span'
                });
            })
        });

    });

});
