import {Block} from '../src/index';
import {assert} from 'chai';
import {mixin} from '../src/mixin';

describe('mixin', () => {
    it('mix', () => {
        class BemClass extends Block {
        }

        const newClass = mixin(BemClass, {
            test() {
                return 1;
            }
        });

        const b = new newClass();

        assert.equal(b.test(), 1);
    });
});
