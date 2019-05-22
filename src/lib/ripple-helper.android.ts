import { Color } from "tns-core-modules/color";
import * as platform from "tns-core-modules/platform";
import { View } from "tns-core-modules/ui/page/page";
import { Length } from "tns-core-modules/ui/styling/style-properties";
import { RippleHelperCommon } from "./ripple-helper.common";

declare const android: any;
declare const Array: any;

const MARSHMALLOW = 23;
const LOLLIPOP = 21;

function getInDP(radius: Length): number {
    return Length.toDevicePixels(radius, 0);
}


export class RippleHelper extends RippleHelperCommon {
    private hasCachedBackground = true;
    private cachedRippleDrawable: any;
    private cachedViewBackground: any;
    private originalNSFn: any;
    private previousNSFn: any;
    protected _rippleLayer: "background" | "foreground" | "auto" = android.os.Build.VERSION.SDK_INT < MARSHMALLOW ? "background" : "auto";
    protected _enabled = android.os.Build.VERSION.SDK_INT >= LOLLIPOP;

    get enabled() {
        return this._enabled;
    }
    set enabled(v: boolean) {
        if (android.os.Build.VERSION.SDK_INT >= LOLLIPOP) {
            this._enabled = !!v;
            this.refreshRippleState();
        }
    }

    get rippleLayer(): "background" | "foreground" | "auto" {
        return this._rippleLayer;
    }
    set rippleLayer(layer: "background" | "foreground" | "auto") {
        const oldLayer = this._rippleLayer;
        if (platform.isAndroid) {
            if (android.os.Build.VERSION.SDK_INT < MARSHMALLOW) {
                if (this._rippleLayer !== "background") { this._rippleLayer = "background"; }
            } else if (["background", "foreground", "auto"].indexOf(layer) >= 0 && layer !== this._rippleLayer) {
                this._rippleLayer = layer;
            } else {
                this._rippleLayer = "auto";
            }
        }
        if (oldLayer !== this._rippleLayer) {
            this.refreshRippleState();
        }
    }

    constructor(tnsView: View) {
        super(tnsView);
        this.originalNSFn = (<any>tnsView)._redrawNativeBackground;
    }

    init() {
        const tnsView: any = this.tnsView.get();
        if (tnsView) {
            this.previousNSFn = tnsView._redrawNativeBackground; // monkey should play nice with other monkeys
            tnsView._redrawNativeBackground = this.monkeyPatch;
        }
        super.init();
    }

    dispose() {
        super.dispose();
        const tnsView: any = this.tnsView.get();
        if (tnsView) {
            tnsView._redrawNativeBackground = this.originalNSFn;
        }
        this.hasCachedBackground = false;
        this.cachedRippleDrawable = null;
        this.cachedViewBackground = null;
    }

    onLoaded() {
        this.refreshRippleState();
    }

    protected apply(): boolean {
        const tnsView = this.tnsView.get();
        if (tnsView && tnsView instanceof View && tnsView.android) {
            if (android.os.Build.VERSION.SDK_INT >= LOLLIPOP) {
                const androidView = tnsView.android;
                const actualRipple = this.getTargetRipple();
                const targetLayer = this.getTargetLayer();
                // remove conflicting ripples
                if (targetLayer === "foreground" && androidView.getBackground() instanceof (<any>android.graphics.drawable).RippleDrawable) {
                    androidView.setBackground(androidView.getBackground().getDrawable(0));
                } else if (targetLayer === "background" && android.os.Build.VERSION.SDK_INT >= MARSHMALLOW && androidView.getForeground() instanceof (<any>android.graphics.drawable).RippleDrawable) {
                    androidView.setForeground(androidView.getForeground().getDrawable(0));
                }
                let originalBg = targetLayer === "background" ? androidView.getBackground() : androidView.getForeground();
                if (!originalBg) {
                    originalBg = new android.graphics.drawable.ColorDrawable(new Color("transparent").android);
                }
                let drawable;
                let mask;
                if (originalBg instanceof (<any>android.graphics.drawable).RippleDrawable && originalBg.getNumberOfLayers() < 2) {
                    // previous ripple didn't need a mask!
                    mask = null;
                } else {
                    const outerRadii = Array.create('float', 8);
                    outerRadii[0] = outerRadii[1] = getInDP(tnsView.borderTopLeftRadius);
                    outerRadii[2] = outerRadii[3] = getInDP(tnsView.borderTopRightRadius);
                    outerRadii[4] = outerRadii[5] = getInDP(tnsView.borderBottomRightRadius);
                    outerRadii[6] = outerRadii[7] = getInDP(tnsView.borderBottomLeftRadius);
                    const r = new android.graphics.drawable.shapes.RoundRectShape(outerRadii, null, null);
                    mask = new android.graphics.drawable.ShapeDrawable(r);
                    mask.getPaint().setColor(android.graphics.Color.BLACK);
                }
                console.log(targetLayer, tnsView, this.rippleLayer);
                if (actualRipple) {
                    actualRipple.setColor(android.content.res.ColorStateList.valueOf(this.effectiveColor.android));
                    const layer0Id = actualRipple.getId(0);
                    actualRipple.setDrawableByLayerId(layer0Id,
                        originalBg instanceof (<any>android.graphics.drawable).RippleDrawable ? originalBg.getDrawable(0) :
                            originalBg);
                    if (mask) {
                        const layer1Id = actualRipple.getId(1);
                        actualRipple.setDrawableByLayerId(layer1Id, mask);
                    }
                    drawable = actualRipple;
                } else {
                    drawable = new (<any>android.graphics.drawable).RippleDrawable(
                        android.content.res.ColorStateList.valueOf(this.effectiveColor.android),
                        originalBg instanceof (<any>android.graphics.drawable).RippleDrawable ? originalBg.getDrawable(0) :
                            originalBg,
                        mask);
                    this.cachedRippleDrawable = drawable;
                }

                if (targetLayer === "background") {
                    androidView.setBackground(drawable);
                } else {
                    androidView.setForeground(drawable);
                }
                return true;
            }
        }
        return false;
    }

    remove() {
        const tnsView = this.tnsView.get();
        if (tnsView && tnsView instanceof View && tnsView.android) {
            if (android.os.Build.VERSION.SDK_INT >= LOLLIPOP) {
                this.getTargetLayer();
                const androidView = tnsView.android;
                const targetLayer = this.getTargetLayer();
                if (targetLayer === "foreground" && androidView.getForeground() instanceof (<any>android.graphics.drawable).RippleDrawable) {
                    androidView.setForeground(androidView.getForeground().getDrawable(0));
                } else if (androidView.getBackground() instanceof (<any>android.graphics.drawable).RippleDrawable) {
                    androidView.setBackground(androidView.getBackground().getDrawable(0));
                }
                return true;
            }
        }
        return false;
    }

    protected refreshRippleColor() {
        let actualRipple = this.getTargetRipple();
        if (actualRipple) {
            actualRipple.setColor(android.content.res.ColorStateList.valueOf(this.effectiveColor.android));
        }
    }

    private getTargetRipple(): any {
        let actualRipple;
        const tnsView = this.tnsView.get();
        if (tnsView) {
            const nativeView = tnsView.android;
            if (nativeView) {
                if (this._rippleLayer === "background" || this._rippleLayer === "auto") {
                    if (nativeView && nativeView.getBackground() instanceof android.graphics.drawable.RippleDrawable) {
                        actualRipple = nativeView.getBackground();
                    }
                }
                if (this._rippleLayer === "foreground" || (!actualRipple && this._rippleLayer === "auto")) {
                    if (nativeView && nativeView.getForeground() instanceof android.graphics.drawable.RippleDrawable) {
                        actualRipple = nativeView.getForeground();
                    }
                }
            }
            actualRipple = actualRipple || this.cachedRippleDrawable;
        }
        return actualRipple;
    }

    private getTargetLayer(): "background" | "foreground" {
        let target: "background" | "foreground" = this.rippleLayer === "auto" ? "foreground" : this.rippleLayer;
        const tnsView = this.tnsView.get();
        if (tnsView) {
            const nativeView = tnsView.android;
            if (this._rippleLayer === "auto") {
                if (nativeView) {
                    if (nativeView.getBackground() instanceof android.graphics.drawable.RippleDrawable) {
                        target = "background";
                    } else if (nativeView.getForeground() instanceof android.graphics.drawable.RippleDrawable) {
                        target = "foreground";
                    }
                } else {
                    target = "foreground";
                }
            }
        }

        return target;
    }

    private monkeyPatch = (val) => {
        const tnsView: View = this.tnsView.get();
        if (tnsView) {
            if (this.hasCachedBackground && tnsView.android.getBackground() !== this.cachedViewBackground) { // reset the background
                tnsView.android.setBackground(this.cachedViewBackground);
            }
            this.previousNSFn.call(tnsView, val);
            this.hasCachedBackground = true;
            this.cachedViewBackground = tnsView.android.getBackground();
            this.refreshRippleState();
        }
    }
}
