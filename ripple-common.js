"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("tns-core-modules/ui/core/properties");
var content_view_1 = require("tns-core-modules/ui/content-view");
var view_1 = require("tns-core-modules/ui/core/view");
var color_1 = require("tns-core-modules/color");
var Ripple = (function (_super) {
    __extends(Ripple, _super);
    function Ripple() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rippleColor = null;
        _this.content = null;
        return _this;
    }
    Ripple.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof view_1.View) {
            this.content = value;
        }
    };
    return Ripple;
}(content_view_1.ContentView));
exports.Ripple = Ripple;
exports.rippleColorProperty = new properties_1.Property({
    name: "rippleColor", equalityComparer: color_1.Color.equals, valueConverter: function (v) { return new color_1.Color(v); }
});
exports.rippleColorProperty.register(Ripple);
exports.rippleAlphaProperty = new properties_1.Property({
    name: "rippleAlpha", affectsLayout: true
});
exports.rippleAlphaProperty.register(Ripple);
exports.rippleDurationProperty = new properties_1.Property({
    name: "rippleDuration", affectsLayout: true
});
exports.rippleDurationProperty.register(Ripple);
exports.fadeDurationProperty = new properties_1.Property({
    name: "fadeDuration", affectsLayout: true
});
exports.fadeDurationProperty.register(Ripple);
