var hasOwnProp = Object.prototype.hasOwnProperty;

function extend(o1, o2) {
    for (var i in o2) {
        if (hasOwnProp.call(o2, i)) {
            o1[i] = o2[i];
        }
    }

    return o1;
}

function buildCheckMod(modName, modVal) {

    if (!modVal) {
        return function(block) { return block.hasMod(modName); };
    }

    if (!Array.isArray(modVal)) {
        return function(block) { return block.hasMod(modName, modVal); };
    }

    return function(block) {
        return modVal.some(block.hasMod.bind(block, modName));
    };
}

var toStr = Object.prototype.toString;

function isFunction(obj) {
    return toStr.call(obj) === '[object Function]';
}

function isObject(obj) {
    return toStr.call(obj) === '[object Object]';
}

function wrapTryCatchObj(obj) {

    Object.keys(obj).filter(function(prop) {
        return isFunction(obj[prop]);
    }).forEach(function(prop) {
        obj[prop] = wrapTryCatchMethod(obj[prop]);
    });

}

function wrapTryCatchMethod(method) {
    return function() {
        try {
            return method.apply(this, arguments);
        } catch (e) {
            return '';
        }
    };
}
/**
 * Storage for block declarations (hash by block name)
 * @private
 * @type Object
 */
var blocks = {};
/**
 * @class BEMPRIV
 * @description Base block for creating BEMPRIV blocks
 * @augments events:Emitter
 * @exports
 */
var BEMPRIV = inherit(/** @lends BEMPRIV.prototype */ {

    /**
     * @constructor
     * @private
     * @param {Object} data Per-Request data, shoud be provided to every block
     * @param {Object} params Block parameters
     */
    __constructor: function(data, params) {

        /**
         * Per-Request data
         */
        this.data = data;

        /**
         * Block's BEMJSON
         * @private
         */
        this._bemjson = {
            block: this.__self.getName()
        };

        if (params && params.mods) {
            this.mods(params.mods);
            delete params.mods;
        }

        /**
         * Block parameters, taking into account the defaults
         * @member {Object}
         * @readonly
         */
        this.params = extend(this.getDefaultParams(), params);

        var initReturn = this.init();

        if (typeof initReturn !== 'undefined') {
            this._initReturn = initReturn;
        }

    },

    /**
     * Public constructor called arter __constructor
     * @protected
     */
    init: function() {},

    /**
     * Returns a block's default parameters
     * @protected
     * @returns {Object}
     */
    getDefaultParams: function() {
        return {};
    },

    /**
     * Return's block's BEMJSON or init() return
     * @param {Mixed} block
     * @param {Object} params
     * @returns {OBJECT}
     */
    json: function(block, params) {
        if (block) {
            return this.__self.json(block, this.data, params);
        }
        return typeof this._initReturn === 'undefined' ? this._bemjson : this._initReturn;
    },

    /**
     * Set/Get block's mod
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    mod: function(key, value) {
        return this.deepProp('mods', key, value);
    },

    /**
     * Check if block has mod
     * @protected
     * @returns {Boolean}
     */
    hasMod: function(modName, modValue) {
        return this.deepProp('mods', modName) === modValue;
    },

    /**
     * Sets block's mods
     * @param {Mixed} value
     * @protected
     */
    mods: function(value) {
        return this.extendProp('mods', value);
    },

    /**
     * Set/Get block's attr
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    attr: function(key, value) {
        return this.deepProp('attrs', key, value);
    },

    /**
     * Set/Get block's attrs
     * @param {Object} value
     * @protected
     */
    attrs: function(value) {
        return this.prop('attrs', value);
    },

    /**
     * Set/Get block's JS
     * @param {Object|Boolean} value
     * @protected
     */
    js: function(value) {
        return this.extendProp('js', value);
    },

    /**
     * Set/Get block's csl
     * @param {String} value
     * @protected
     */
    cls: function(value) {
        return this.prop('cls', value);
    },

    /**
     * Set/Get block's content
     * @param {Mixed} value
     * @protected
     */
    content: function(value) {
        return this.prop('content', value);
    },

    /**
     * Set/Get block's tag
     * @param {Mixed} value
     * @protected
     */
    tag: function(value) {
        return this.prop('tag', value);
    },

    /**
     * Set/Get block's mix
     * @param {Array|Object} value
     * @protected
     */
    mix: function(value) {

        if (!this.prop('mix')) {
            this.prop('mix', []);
        }

        if (typeof value === 'undefined') {
            return this.prop('mix');
        }

        if (Array.isArray(value)) {
            this.prop('mix', this.prop('mix').concat(value));
        } else {
            this.prop('mix').push(value);
        }

        return this;

    },

    /**
     * Set/Get block's custom bemjson property
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    prop: function(key, value) {

        if (typeof value !== 'undefined') {
            this._bemjson[key] = value;
            return this;
        }

        return this._bemjson[key];

    },

    /**
     * Extend block's property if it was an object, or just assign new value if not
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    extendProp: function(key, value) {

        var oldValue = this.prop(key);

        if (isObject(oldValue) && isObject(value)) {
            return this.prop(key, extend(oldValue, value));
        }

        return this.prop(key, value);

    },

    /**
     * Set block's custom bemjson properties
     * @param {Object} props
     * @protected
     */
    props: function(props) {

        Object.keys(props).forEach(function(prop) {
            this._bemjson[prop] = props[prop];
        }.bind(this));

        return this;

    },

    /**
     * Set/Get block's custom bemjson property
     * for example if you want to add href attr { attrs: { href: 'http://w3c.org'} }
     * prop is "attrs", key is "href" and value is "http://w3c.org"
     * @param {String} prop
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    deepProp: function(prop, key, value) {

        if (typeof this._bemjson[prop] === 'undefined') {
            this._bemjson[prop] = {};
        }

        if (typeof value === 'undefined') {
            return this._bemjson[prop][key];
        }

        this._bemjson[prop][key] = value;
        return this;

    },

    /**
     * Create new BEMPRIV block with current data
     */
    block: function(block, params) {
        return this.__self.create(block, this.data, params);
    },

    /**
     * Returns block's BEMJSON
     * @deprecated please use bemjson method
     * @returns {Object}
     */
    getBEMJSON: function() {
        console.info('DEPRECATED. Please use this.json()');
        return this.json();
    },

    /**
     * Returns block's BEMJSON
     * @deprecated please use bemjson method
     * @returns {Object}
     */
    bemjson: function() {
        console.info('DEPRECATED. Please use this.json()');
        return this.json();
    }

}, /** @lends BEMPRIV */{

    _name: 'bem',

    /**
     * Declares blocks and elements, and creates a block class
     * @param {String} decl Block name (simple syntax) or description
     * @param {String} decl.block|decl.name Block name
     * @param {String} [decl.baseBlock] Name of the parent block
     * @param {String} [decl.elem] Name of the declared elements
     * @param {Array} [decl.baseMix] Mixed block names
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     * @returns {Function}
     */
    decl: function(decl, props, staticProps) {

        // string as block
        if (typeof decl === 'string') {
            decl = { block: decl };
        }

        // inherit from itself
        if (arguments.length <= 2 && typeof decl === 'object' && (!decl || (typeof decl.block !== 'string'))) {

            staticProps = props;
            props = decl;
            decl = {};

        }

        if (typeof decl.block === 'undefined') {
            decl.block = this.getName();
        }

        var baseBlock;

        if (typeof decl.baseBlock === 'undefined') {
            baseBlock = blocks[decl.block] || this;
        } else if (typeof decl.baseBlock === 'string') {

            baseBlock = blocks[decl.baseBlock];

            if (!baseBlock) {
                throw('baseBlock "' + decl.baseBlock + '" for "' + decl.block + '" is undefined');
            }

        } else {
            baseBlock = decl.baseBlock;
        }

        if (decl.modName) {
            var checkMod = buildCheckMod(decl.modName, decl.modVal);
            var prop;
            var self = this;
            Object.keys(props).forEach(function(name) {
                prop = props[name];
                if (isFunction(prop)) {
                    props[name] = (function(name, prop) {
                        return function() {
                            var method;
                            if (checkMod(this)) {
                                method = prop;
                            } else {
                                var baseMethod = baseBlock.prototype[name];
                                if (baseMethod && baseMethod !== prop) {
                                    method = this.__base;
                                }
                            }
                            return method ?
                                method.apply(this, arguments) :
                                undefined;
                        };
                    }(name, prop));
                }
            });
        }

        var block,
            baseBlocks = baseBlock;

        if (decl.baseMix) {

            baseBlocks = [baseBlocks];

            decl.baseMix.forEach(function(mixedBlock) {
                if (!blocks[mixedBlock]) {
                    throw('mix block "' + mixedBlock + '" for "' + decl.block + '" is undefined');
                }
                baseBlocks.push(blocks[mixedBlock]);
            });

        }

        if (decl.block === baseBlock.getName()) {
            block = inherit.self(baseBlocks, props, staticProps);
        } else {
            (block = blocks[decl.block] = inherit(baseBlocks, props, staticProps))._name = decl.block;
        }

        return block;

    },

    /**
     * Factory method for creating an instance of the block named
     * @param {String} block Block name
     * @param {Object} data per-request data
     * @param {Object} [params] block parameters
     * @returns {BEM}
     */
    create: function(block, data, params) {
        params = params || {};
        if (typeof block === 'string') {
            block = {
                block: block
            };
        } else if (block.mods) {
            params.mods = block.mods;
        }
        return new blocks[block.block](data, params);
    },

    /**
     * Factory method for getting block's BEMJSON
     * @param {String|Object} block Block name or description
     * @param {Object} data per-request data
     * @param {Object} [params] Block parameters
     * @returns {Object}
    */
    json: function(block, data, params) {
        return this.create(block, data, params).json();
    },

    /**
     * Returns the name of the current block
     * @returns {String}
     */
    getName: function() {
        return this._name;
    },

    /**
     * Returns the static instance of block
     * @param {String} name
     * @returns {BEM}
     */
    block: function(name) {
        return blocks[name];
    },

    /**
     * Returns decls of all blocks
     * @returns {Object}
     */
    blocks: function() {
        return blocks;
    },

    /**
     * Wrap methods in try/catch to safety use in production
     * @param {String} block wrap only some blocks
     * @param {Boolean} onlyFactory wrap only factory method
     */
    wrapTryCatch: function(block, onlyFactory) {

        if (this._wrapped) {
            return;
        }

        this._wrapped = true;

        if (typeof onlyFactory === 'undefined') {
            onlyFactory = true;
        }

        if (block && blocks[block]) {
            block = blocks[block];

            wrapTryCatchObj(block);
            wrapTryCatchObj(block.prototype);
            return;
        }

        if (onlyFactory) {
            this.create = wrapTryCatchMethod(this.create);
            return;
        }

        Object.keys(blocks).forEach(function(name) {
            wrapTryCatchObj(blocks[name]);
            wrapTryCatchObj(blocks[name].prototype);
        });

    },

    inherit: inherit

});
