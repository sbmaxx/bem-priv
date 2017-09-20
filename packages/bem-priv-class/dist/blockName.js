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
function BlockName(name) {
    return function (target) {
        return (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super.call(this) || this;
            }
            Object.defineProperty(class_1.prototype, "block", {
                get: function () {
                    return name;
                },
                enumerable: true,
                configurable: true
            });
            return class_1;
        }(target));
    };
}
exports.BlockName = BlockName;
