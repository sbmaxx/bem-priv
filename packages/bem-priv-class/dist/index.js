"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var behavior_1 = require("./behavior");
var Block = (function (_super) {
    __extends(Block, _super);
    function Block(params) {
        var _this = _super.call(this) || this;
        _this.params = Object.assign(_this.defaultParams, params);
        _this._bemjson = {
            block: _this.block
        };
        return _this;
    }
    Object.defineProperty(Block.prototype, "defaultParams", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "block", {
        get: function () {
            return this.constructor.name.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "mods", {
        get: function () {
            return this._getProp(Block.MODS_KEY);
        },
        set: function (mods) {
            this._bemjson[Block.MODS_KEY] = mods;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "mix", {
        get: function () {
            return this._getProp(Block.MIX_KEY);
        },
        set: function (mix) {
            this._bemjson[Block.MIX_KEY] = mix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "attrs", {
        get: function () {
            return this._getProp(Block.ATTRS_KEY);
        },
        set: function (attrs) {
            this._bemjson[Block.ATTRS_KEY] = attrs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "js", {
        get: function () {
            return this._getProp(Block.PARAMS_KEY);
        },
        set: function (params) {
            this._extendProp(Block.PARAMS_KEY, params);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "content", {
        get: function () {
            return this._getProp(Block.CONTENT_KEY);
        },
        set: function (content) {
            this._bemjson[Block.CONTENT_KEY] = content;
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.addProps = function (props) {
        Object.assign(this._bemjson, props);
    };
    Block.prototype._getProp = function (key) {
        if (!this._bemjson[key]) {
            this._bemjson[key] = key === Block.MIX_KEY || key === Block.CONTENT_KEY ? [] : {};
        }
        return this._bemjson[key];
    };
    Block.prototype._extendProp = function (key, value) {
        Object.assign(this._getProp(key), value);
    };
    Block.MODS_KEY = 'mods';
    Block.MIX_KEY = 'mix';
    Block.ATTRS_KEY = 'attrs';
    Block.PARAMS_KEY = 'js';
    Block.CONTENT_KEY = 'content';
    return Block;
}(behavior_1.Behavior));
exports.Block = Block;
var ComplexBlock = (function (_super) {
    __extends(ComplexBlock, _super);
    function ComplexBlock(params) {
        var _this = _super.call(this, params) || this;
        _this.compositions = [];
        return _this;
    }
    ComplexBlock.prototype.json = function () {
        var _this = this;
        if (this.compositions.length) {
            this.compositions.forEach(function (composition) {
                _this.content.push(composition.json());
            });
        }
        _super.prototype.json.call(this);
        return this._bemjson;
    };
    ComplexBlock.prototype.addComposition = function (block) {
        this.compositions.push(block);
        return this;
    };
    ComplexBlock.createBlock = function (BlockImpl, props) {
        if (props === void 0) { props = {}; }
        var compositions = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            compositions[_i - 2] = arguments[_i];
        }
        var behaviors = props.behaviors, params = __rest(props, ["behaviors"]);
        var block = new BlockImpl(params);
        if (behaviors) {
            behaviors.forEach(function (behavior) {
                block.addBehavior(behavior);
            });
        }
        compositions.forEach(function (composition) {
            block.addComposition(composition);
        });
        return block;
    };
    return ComplexBlock;
}(Block));
exports.ComplexBlock = ComplexBlock;
