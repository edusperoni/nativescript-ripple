"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common = require("./ripple-common");
var view_1 = require("tns-core-modules/ui/core/view");
var color_1 = require("tns-core-modules/color");
var gestures_1 = require("tns-core-modules/ui/gestures");
var Ripple = (function (_super) {
    __extends(Ripple, _super);
    function Ripple() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ripple.prototype.performRipple = function (x, y) {
        var _this = this;
        if (!(this.content instanceof view_1.View)) {
            return;
        }
        var nativeView = this.content.ios;
        var scale = 8.0;
        var size = this.content.getActualSize();
        var radius = Math.min(Math.min(size.height, size.width) / scale * 0.8, 60);
        var ripple = UIView.alloc().initWithFrame(CGRectMake(0, 0, radius, radius));
        ripple.layer.cornerRadius = radius * 0.5;
        ripple.backgroundColor = (this.content.backgroundColor || new color_1.Color('#000000')).ios;
        ripple.alpha = 1.0;
        nativeView.insertSubviewAtIndex(ripple, 0);
        ripple.center = CGPointMake(x || 0, y || 0);
        UIView.animateWithDurationDelayOptionsAnimationsCompletion(0.6, 0, UIViewAnimationOptionCurveEaseOut, function () {
            ripple.transform = CGAffineTransformMakeScale(scale, scale);
            ripple.alpha = 0.0;
            ripple.backgroundColor = new color_1.Color(_this.rippleColor.hex || '#cecece').ios;
        }, function (finished) {
            ripple.removeFromSuperview();
        });
    };
    Ripple.prototype.onLoaded = function () {
        var _this = this;
        _super.prototype.onLoaded.call(this);
        if (this.content instanceof view_1.View) {
            this.tapFn = function (args) {
                _this.performRipple(args.getX(), args.getY());
            };
            this.content.on(gestures_1.GestureTypes.touch, this.tapFn);
        }
        else {
            throw new Error("Content must inherit from View!");
        }
    };
    Ripple.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        if (this.content instanceof view_1.View) {
            this.content.off(gestures_1.GestureTypes.tap, this.tapFn);
        }
    };
    return Ripple;
}(common.Ripple));
exports.Ripple = Ripple;
