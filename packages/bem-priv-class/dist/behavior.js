"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Behavior = (function () {
    function Behavior() {
        this.behaviors = [];
        this._bemjson = {};
    }
    Behavior.prototype.json = function () {
        if (this.behaviors.length) {
            this.behaviors.forEach(function (behavior) {
                return behavior.json();
            });
        }
        return this._bemjson;
    };
    Object.defineProperty(Behavior.prototype, "bemjson", {
        set: function (bemjson) {
            this._bemjson = bemjson;
        },
        enumerable: true,
        configurable: true
    });
    Behavior.prototype.addBehavior = function (block) {
        block.bemjson = this._bemjson;
        this.behaviors.push(block);
        return this;
    };
    return Behavior;
}());
exports.Behavior = Behavior;
