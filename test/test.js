var expect = require('chai').expect;
var BEM = require('../bem');

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

        describe('#getBEMJSON', function() {
            it('should be an object', function() {
                expect(b.getBEMJSON()).to.be.a('object');
            });
            it('should have block property', function() {
                var bemjson = b.getBEMJSON();
                expect(bemjson).to.have.keys(['block']);
                expect(bemjson).to.have.a.property('block');
                expect(bemjson.block).to.be.equal('bem');
            });
        });

  });

});
