var inherit = require('inherit');

(function(global) {

var hasOwnProp = Object.prototype.hasOwnProperty;

function extend(target, source) {
    typeof target !== 'object' && (target = {});

    for(var i = 1, len = arguments.length; i < len; i++) {
        var obj = arguments[i];
        if(obj) {
            for(var key in obj) {
                hasOwnProp.call(obj, key) && (target[key] = obj[key]);
            }
        }
    }

    return target;
}

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
var BEMPRIV = inherit(/** @lends BEM.prototype */ {

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

        /**
         * Block's BEMJSON
         * @private
         */
        this._bemjson = {
            block: this.__self.getName()
        }

    },

    /**
     * Returns a block's default parameters
     * @protected
     * @returns {Object}
     */
    getDefaultParams : function() {
        return {};
    },

    /**
     * Returns block's BEMJSON
     * @returns {Object}
     */
    getBEMJSON : function() {
        return this._bemjson;
    },

    /**
     * Sets block's mod
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    mod : function(key, value) {
        return this._property('mods', key, value);
    },

    /**
     * Sets block's mods
     * @param {Mixed} value
     * @protected
     */
    mods : function(value) {
        return this._property('mods', undefined, value);
    },

    /**
     * Sets block's attr
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    attr: function(key, value) {
        return this._property('attrs', key, value);
    },

    /**
     * Sets block's attrs
     * @param {Object} value
     * @protected
     */
    attrs : function(value) {
        return this._property('attrs', undefined, value);
    },

    /**
     * Sets block's JS
     * @param {Object | Boolean} js
     * @protected
     */
    js : function(value) {
        return this._property('js', undefined, value);
    },

    /**
     * Sets block's csl
     * @param {String} value
     * @protected
     */
    cls : function(value) {
        return this._property('cls', undefined, value);
    },

    /**
     * Sets block's content
     * @param {Mixed} value
     * @protected
     */
    content : function(value) {
        return this._property('content', undefined, value);
    },

    /**
     * Sets block's tag
     * @param {Mixed} value
     * @protected
     */
    tag : function(value) {
        return this._property('tag', undefined, value);
    },

    /**
     * Sets block's mix
     * @param {Array} value
     * @protected
     */
    mix : function(value) {
        return this._property('mix', undefined, value);
    },

    /**
     * Sets BEMJSON param
     * @param {String} property
     * @param {String} key
     * @param {Mixed}  value
     * @private
     */
    _property : function(property, key, value) {

        var hasKey = typeof key !== 'undefined';

        if (typeof value !== 'undefined') {
            if (hasKey) {
                if (typeof this._bemjson[property] === 'undefined') {
                    this._bemjson[property] = (property === 'mix') ? [] : {};
                }
                this._bemjson[property][key] = value;
            } else {
                this._bemjson[property] = value;
            }
            return this;
        }

        return hasKey ? this._bemjson[property][key] : this._bemjson[property];

    }


}, /** @lends BEM */{

    blocks: blocks,

    _name : 'bem',

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
        return new blocks[block](params);
    },

    /**
     * Factory method for getting block's BEMJSON
     * @param {String|Object} block Block name or description
     * @param {Object} [params] Block parameters
     * @returns {Object}
    */
    json : function(block, params) {
        return this.create(block, params).getBEMJSON();
    },

    /**
     * Returns the name of the current block
     * @returns {String}
     */
    getName : function() {
        return this._name;
    }

});

var defineAsGlobal = true;

if(typeof exports === 'object') {
    module.exports = BEMPRIV;
    defineAsGlobal = false;
}

if(typeof modules === 'object') {
    modules.define('BEM', function(provide) {
        provide(BEMPRIV);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = BEMPRIV;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.BEM = BEMPRIV);

})(this);
