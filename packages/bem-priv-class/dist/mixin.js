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
Object.defineProperty(exports, "__esModule", { value: true });
var mixinHooks = [
    'constructor',
    'block',
    'defaultParams',
    '_getProp',
    '_extendProp'
];
function mixin(target) {
    var mixins = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        mixins[_i - 1] = arguments[_i];
    }
    var newClass = (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return class_1;
    }(target));
    mixins.forEach(function (mixin) {
        var proto = typeof mixin === 'function' ? mixin.prototype : mixin;
        Object.getOwnPropertyNames(proto).forEach(function (key) {
            if (mixinHooks.indexOf(key) > -1) {
                return;
            }
            var mix = proto[key];
            var isFunction = typeof mix === 'function';
            var isPrivate = key.startsWith('_');
            var isEnumerable = !isFunction && !isPrivate;
            Object.defineProperty(newClass.prototype, key, {
                value: mix,
                enumerable: isEnumerable,
                writable: !isFunction
            });
        });
    });
    return newClass;
}
exports.mixin = mixin;
