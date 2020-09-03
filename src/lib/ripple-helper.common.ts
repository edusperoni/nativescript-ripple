import { Color, View } from "@nativescript/core";
import { addWeakEventListener } from "@nativescript/core/ui/core/weak-event-listener";

export class RippleHelperCommon {
    protected static DEFAULT_RIPPLE_ALPHA = 0.25;
    protected tnsView: WeakRef<View>;
    protected effectiveColor: Color = new Color(0.25 * 255, 0, 0, 0);
    protected _rippleColor: string | Color;
    protected _rippleColorAlpha: number | null | undefined;
    protected _enabled: boolean = true;
    protected rippleApplied: boolean = false;
    protected _rippleLayer: "background" | "foreground" | "auto";
    protected initialized = false;

    get enabled() {
        return this._enabled;
    }
    set enabled(v: boolean) {
        this._enabled = !!v;
        this.refreshRippleState();
    }

    get rippleLayer(): "background" | "foreground" | "auto" {
        return this._rippleLayer;
    }
    set rippleLayer(layer: "background" | "foreground" | "auto") {
        /* */
    }
    get color(): string | Color {
        return this._rippleColor;
    }
    set color(v: string | Color) {
        this._rippleColor = v;
        this.invalidateColor();
    }

    set alpha(v: number | null | undefined) {
        this._rippleColorAlpha = v;
        this.invalidateColor();
    }
    get alpha(): number | null | undefined {
        return this._rippleColorAlpha;
    }

    constructor(tnsView: View) {
        this.tnsView = new WeakRef(tnsView);
    }

    init() {
        this.initialized = true;
        this.setEffectiveColor();
        this.bindEvents();
        this.refreshRippleState();
    }

    dispose() {
        /* */
    }

    refreshRippleState() {
        if (!this.initialized) { return; }
        if (this.enabled) {
            this.rippleApplied = this.apply();
        } else {
            this.rippleApplied = !this.remove();
        }
    }

    protected apply(): boolean {
        return false;
    }

    protected remove(): boolean {
        return false;
    }

    protected invalidateColor() {
        this.setEffectiveColor();
        if (this.initialized) { this.refreshRippleColor(); }
    }

    protected refreshRippleColor() {
        /* */
    }

    protected onLoaded() {
        this.refreshRippleState();
    }

    protected onUnloaded() {
        /** */
    }
    private setEffectiveColor() {
        let c: Color;
        if (this._rippleColor) {
            if (this._rippleColor instanceof Color) {
                c = this._rippleColor;
            } else {
                c = new Color(this._rippleColor);
            }
        } else {
            c = new Color("#000000");
        }
        let alpha = RippleHelperCommon.DEFAULT_RIPPLE_ALPHA;
        if (this.alpha !== null && this.alpha !== undefined) {
            alpha = +this.alpha;
        }
        c = new Color(c.a * alpha, c.r, c.g, c.b);
        this.effectiveColor = c;
    }
    private bindEvents() {
        const tnsView = this.tnsView.get();
        if (tnsView) {
            addWeakEventListener(tnsView, View.loadedEvent, this.onLoaded, this);
            addWeakEventListener(tnsView, View.unloadedEvent, this.onUnloaded, this);
            // in some cases, the element is already loaded by time of binding
            if (tnsView.isLoaded) {
                this.onLoaded();
            }
        }
    }
}
