var inherit = (function() {
// include src/inherit.js
/**
 * @module inherit
 * @version 2.2.2
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 */

var hasIntrospection = (function(){'_';}).toString().indexOf('_') > -1,
    emptyBase = function() {},
    hasOwnProperty = Object.prototype.hasOwnProperty,
    objCreate = Object.create || function(ptp) {
        var inheritance = function() {};
        inheritance.prototype = ptp;
        return new inheritance();
    },
    objKeys = Object.keys || function(obj) {
        var res = [];
        for(var i in obj) {
            hasOwnProperty.call(obj, i) && res.push(i);
        }
        return res;
    },
    extend = function(o1, o2) {
        for(var i in o2) {
            hasOwnProperty.call(o2, i) && (o1[i] = o2[i]);
        }

        return o1;
    },
    toStr = Object.prototype.toString,
    isArray = Array.isArray || function(obj) {
        return toStr.call(obj) === '[object Array]';
    },
    isFunction = function(obj) {
        return toStr.call(obj) === '[object Function]';
    },
    noOp = function() {},
    needCheckProps = true,
    testPropObj = { toString : '' };

for(var i in testPropObj) { // fucking ie hasn't toString, valueOf in for
    testPropObj.hasOwnProperty(i) && (needCheckProps = false);
}

var specProps = needCheckProps? ['toString', 'valueOf'] : null;

function getPropList(obj) {
    var res = objKeys(obj);
    if(needCheckProps) {
        var specProp, i = 0;
        while(specProp = specProps[i++]) {
            obj.hasOwnProperty(specProp) && res.push(specProp);
        }
    }

    return res;
}

function override(base, res, add) {
    var addList = getPropList(add),
        j = 0, len = addList.length,
        name, prop;
    while(j < len) {
        if((name = addList[j++]) === '__self') {
            continue;
        }
        prop = add[name];
        if(isFunction(prop) &&
                (!hasIntrospection || prop.toString().indexOf('.__base') > -1)) {
            res[name] = (function(name, prop) {
                var baseMethod = base[name]?
                        base[name] :
                        name === '__constructor'? // case of inheritance from plane function
                            res.__self.__parent :
                            noOp;
                return function() {
                    var baseSaved = this.__base;
                    this.__base = baseMethod;
                    var res = prop.apply(this, arguments);
                    this.__base = baseSaved;
                    return res;
                };
            })(name, prop);
        } else {
            res[name] = prop;
        }
    }
}

function applyMixins(mixins, res) {
    var i = 1, mixin;
    while(mixin = mixins[i++]) {
        res?
            isFunction(mixin)?
                inherit.self(res, mixin.prototype, mixin) :
                inherit.self(res, mixin) :
            res = isFunction(mixin)?
                inherit(mixins[0], mixin.prototype, mixin) :
                inherit(mixins[0], mixin);
    }
    return res || mixins[0];
}

/**
* Creates class
* @exports
* @param {Function|Array} [baseClass|baseClassAndMixins] class (or class and mixins) to inherit from
* @param {Object} prototypeFields
* @param {Object} [staticFields]
* @returns {Function} class
*/
function inherit() {
    var args = arguments,
        withMixins = isArray(args[0]),
        hasBase = withMixins || isFunction(args[0]),
        base = hasBase? withMixins? applyMixins(args[0]) : args[0] : emptyBase,
        props = args[hasBase? 1 : 0] || {},
        staticProps = args[hasBase? 2 : 1],
        res = props.__constructor || (hasBase && base.prototype.__constructor)?
            function() {
                return this.__constructor.apply(this, arguments);
            } :
            hasBase?
                function() {
                    return base.apply(this, arguments);
                } :
                function() {};

    if(!hasBase) {
        res.prototype = props;
        res.prototype.__self = res.prototype.constructor = res;
        return extend(res, staticProps);
    }

    extend(res, base);

    res.__parent = base;

    var basePtp = base.prototype,
        resPtp = res.prototype = objCreate(basePtp);

    resPtp.__self = resPtp.constructor = res;

    props && override(basePtp, resPtp, props);
    staticProps && override(base, res, staticProps);

    return res;
}

inherit.self = function() {
    var args = arguments,
        withMixins = isArray(args[0]),
        base = withMixins? applyMixins(args[0], args[0][0]) : args[0],
        props = args[1],
        staticProps = args[2],
        basePtp = base.prototype;

    props && override(basePtp, basePtp, props);
    staticProps && override(base, base, staticProps);

    return base;
};

return inherit;
})();

var BEMPRIV = (function() {
// include src/bempriv.js
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
    return modVal ?
        Array.isArray(modVal) ?
            function(block) {
                var i = 0, len = modVal.length;
                while (i < len) {
                    if (block.hasMod(modName, modVal[i++])) {
                        return true;
                    }
                }
                return false;
            } :
            function(block) {
                return block.hasMod(modName, modVal);
            } :
        function(block) {
            return block.hasMod(modName);
        };
}
var toStr = Object.prototype.toString;
function isFunction(obj) {
    return toStr.call(obj) === '[object Function]';
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
    __constructor : function(data, params) {

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

        this.init();

    },

    /**
     * Public constructor called arter __constructor
     * @protected
     */
    init : function() {},

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
     * @deprecated please use bemjson method
     * @returns {Object}
     */
    getBEMJSON : function() {
        return this.bemjson();
    },

    /**
     * Return's block's BEMJSON
     * @returns {OBJECT}
     */
    bemjson : function() {
        return this._bemjson;
    },

    /**
     * Sets block's mod
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    mod : function(key, value) {
        return this.deepProp('mods', key, value);
    },

    /**
     * Check if block has mod
     * @protected
     * @returns {Boolean}
     */
    hasMod : function(modName, modValue) {
        return this.deepProp('mods', modName) === modValue;
    },

    /**
     * Sets block's mods
     * @param {Mixed} value
     * @protected
     */
    mods : function(value) {
        return this.prop('mods', value);
    },

    /**
     * Sets block's attr
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    attr: function(key, value) {
        return this.deepProp('attrs', key, value);
    },

    /**
     * Sets block's attrs
     * @param {Object} value
     * @protected
     */
    attrs : function(value) {
        return this.prop('attrs', value);
    },

    /**
     * Sets block's JS
     * @param {Object|Boolean} value
     * @protected
     */
    js : function(value) {
        return this.prop('js', value);
    },

    /**
     * Sets block's csl
     * @param {String} value
     * @protected
     */
    cls : function(value) {
        return this.prop('cls', value);
    },

    /**
     * Sets block's content
     * @param {Mixed} value
     * @protected
     */
    content : function(value) {
        return this.prop('content', value);
    },

    /**
     * Sets block's tag
     * @param {Mixed} value
     * @protected
     */
    tag : function(value) {
        return this.prop('tag', value);
    },

    /**
     * Sets block's mix
     * @param {Array|Object} value
     * @protected
     */
    mix : function(value) {

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
     * Set block's custom bemjson property
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    prop : function(key, value) {

        if (typeof value !== 'undefined') {
            this._bemjson[key] = value;
            return this;
        }

        return this._bemjson[key];

    },

    /**
     * Set block's custom bemjson properties
     * @param {Object} props
     * @protected
     */
    props : function(props) {

        Object.keys(props).forEach(function(prop) {
            this._bemjson[prop] = props[prop];
        }.bind(this));

        return this;

    },

    /**
     * Set block's custom bemjson property
     * for example if you want to add href attr { attrs: { href: 'http://w3c.org'} }
     * prop is "attrs", key is "href" and value is "http://w3c.org"
     * @param {String} prop
     * @param {String} key
     * @param {Mixed} value
     * @protected
     */
    deepProp : function(prop, key, value) {

        if (typeof this._bemjson[prop] === 'undefined') {
            this._bemjson[prop] = {};
        }

        if (typeof value === 'undefined') {
            return this._bemjson[prop][key];
        }

        this._bemjson[prop][key] = value;
        return this;

    }

}, /** @lends BEMPRIV */{

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
        if (typeof decl === 'string') {
            decl = { block : decl };
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
            Object.keys(props).forEach(function(name) {
                prop = props[name];
                if (isFunction(prop)) {
                    props[name] = function() {
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
    create : function(block, data, params) {
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
    json : function(block, data, params) {
        return this.create(block, data, params).bemjson();
    },

    /**
     * Returns the name of the current block
     * @returns {String}
     */
    getName : function() {
        return this._name;
    },

    /**
     * Returns the static instance of block
     * @param {String} name
     * @returns {BEM}
     */
    block : function(name) {
        return blocks[name];
    }

});


// If run within node.js (for testing)
if (typeof exports !== "undefined") {
    exports.BEMPRIV = BEMPRIV;
}

return BEMPRIV;
})();
