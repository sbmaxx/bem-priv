var inherit = require('inherit');
var extend = require('./extend');

/**
 * Storage for block declarations (hash by block name)
 * @private
 * @type Object
 */
var blocks = {};

/**
 * @class BEM
 * @description Base block for creating BEM blocks
 * @augments events:Emitter
 * @exports
 */
var BEM = inherit(/** @lends BEM.prototype */ {
    /**
     * @constructor
     * @private
     * @param {Object} params Block parameters
     */
    __constructor : function(params) {
        /**
         * Block parameters, taking into account the defaults
         * @member {Object}
         * @readonly
         */
        this.params = extend(this.getDefaultParams(), params);

    },

    /**
     * Returns a block's default parameters
     * @protected
     * @returns {Object}
     */
    getDefaultParams : function() {
        return {};
    },

}, /** @lends BEM */{

    _name : 'i-bem',

    /**
     * Declares blocks and creates a block class
     * @param {String} decl Block name (simple syntax) or description
     * @param {String} decl.block|decl.name Block name
     * @param {String} [decl.baseBlock] Name of the parent block
     * @param {Array} [decl.baseMix] Mixed block names
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     * @returns {Function}
     */
    decl : function(decl, props, staticProps) {

        // string as block
        typeof decl === 'string' && (decl = { block : decl });

        // inherit from itself
        if(arguments.length <= 2 &&
                typeof decl === 'object' &&
                (!decl || (typeof decl.block !== 'string'))) {

            staticProps = props;
            props = decl;
            decl = {};

        }

        typeof decl.block === 'undefined' && (decl.block = this.getName());

        var baseBlock;

        if(typeof decl.baseBlock === 'undefined') {
            baseBlock = blocks[decl.block] || this;
        } else if(typeof decl.baseBlock === 'string') {

            baseBlock = blocks[decl.baseBlock];

            if(!baseBlock) {
                throw('baseBlock "' + decl.baseBlock + '" for "' + decl.block + '" is undefined');
            }

        } else {
            baseBlock = decl.baseBlock;
        }

        var block,
            baseBlocks = baseBlock;

        if(decl.baseMix) {

            baseBlocks = [baseBlocks];

            decl.baseMix.forEach(function(mixedBlock) {
                if(!blocks[mixedBlock]) {
                    throw('mix block "' + mixedBlock + '" for "' + decl.block + '" is undefined');
                }
                baseBlocks.push(blocks[mixedBlock]);
            });

        }

        decl.block === baseBlock.getName()?
            (block = inherit.self(baseBlocks, props, staticProps)) :
            (block = blocks[decl.block] = inherit(baseBlocks, props, staticProps))._name = decl.block;

        return block;

    },

    /**
     * Factory method for creating an instance of the block named
     * @param {String|Object} block Block name or description
     * @param {Object} [params] Block parameters
     * @returns {BEM}
     */
    create : function(block, params) {
        typeof block === 'string' && (block = { block : block });

        return new blocks[block.block](params);
    },

    /**
     * Returns the name of the current block
     * @returns {String}
     */
    getName : function() {
        return this._name;
    }

});

module.exports = BEM;