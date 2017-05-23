"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common = require("./ripple-common");
var ripple_common_1 = require("./ripple-common");
var Ripple = (function (_super) {
    __extends(Ripple, _super);
    function Ripple() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._android = null;
        return _this;
    }
    Object.defineProperty(Ripple.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Ripple.prototype[ripple_common_1.rippleColorProperty.setNative] = function (value) {
        this.rippleColor = value.hex;
        this.nativeView.setRippleColor(value.android);
    };
    Ripple.prototype[ripple_common_1.rippleAlphaProperty.setNative] = function (value) {
        this.nativeView.setRippleAlpha(value);
    };
    Ripple.prototype[ripple_common_1.rippleDurationProperty.setNative] = function (value) {
        this.nativeView.setRippleDuration(value);
    };
    Ripple.prototype[ripple_common_1.fadeDurationProperty.setNative] = function (value) {
        this.nativeView.setRippleFadeDuration(value);
    };
    Ripple.prototype.createNativeView = function () {
        this._android = new com.balysv.materialripple.MaterialRippleLayout(this._context);
        this._android.setRippleOverlay(true);
        if (!this._androidViewId)
            this._androidViewId = android.view.View.generateViewId();
        this._android.setId(this._androidViewId);
        return this._android;
    };
    Ripple.prototype.performRipple = function (x, y) {
        this._android.performRipple();
    };
    Ripple.prototype.disposeNativeView = function () {
        this._android = undefined;
    };
    return Ripple;
}(common.Ripple));
exports.Ripple = Ripple;
