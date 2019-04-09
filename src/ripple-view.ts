import { Color } from 'tns-core-modules/color';
import { ContentView } from 'tns-core-modules/ui/content-view';
import { Property } from 'tns-core-modules/ui/core/properties';
import { View, booleanConverter, AddChildFromBuilder } from 'tns-core-modules/ui/core/view';
import { Ripple } from './lib/ripple';

export class RippleView extends ContentView implements AddChildFromBuilder {
    private rippleHelper: Ripple;
    private initialized = false;

    rippleEnabled: boolean;
    rippleColor: string | Color;
    rippleColorAlpha: number | null | undefined;
    rippleLayer: "background" | "foreground" | "auto" = "auto";

    constructor() {
        super();
    }

    public _addChildFromBuilder(name: string, value: any) {
        super._addChildFromBuilder(name, value);
        this.initializeRipple();
    }

    public onLoaded() {
        super.onLoaded();
        this.initializeRipple();
    }

    public disposeNativeView() {
        if (this.initialized) {
            this.initialized = false;
            this.rippleHelper.dispose();
            this.rippleHelper = undefined;
        }
    }

    public _updateEnabled() {
        if (this.rippleHelper) {
            this.rippleHelper.enabled = this.rippleEnabled;
        }
    }

    public _updateColor() {
        if (this.rippleHelper) {
            this.rippleHelper.color = this.rippleColor;
        }
    }

    public _updateAlpha() {
        if (this.rippleHelper) {
            this.rippleHelper.alpha = this.rippleColorAlpha;
        }
    }

    public _updateLayer() {
        if (this.rippleHelper) {
            this.rippleHelper.rippleLayer = this.rippleLayer;
        }
    }

    private initializeRipple() {
        if (this.initialized) { return; }
        if (this.content) {
            this.initialized = true;
            this.rippleHelper = new Ripple(this.content);
            this.rippleHelper.alpha = this.rippleColorAlpha;
            this.rippleHelper.color = this.rippleColor;
            this.rippleHelper.enabled = this.rippleEnabled;
            this.rippleHelper.rippleLayer = this.rippleLayer;
            this.rippleHelper.init();
        }
    }
}

export const rippleColorProperty = new Property<RippleView, Color>({
    name: 'rippleColor',
    equalityComparer: Color.equals,
    valueConverter: v => new Color(v),
    valueChanged: (target) => { target._updateColor(); }
});
rippleColorProperty.register(RippleView);

export const rippleColorAlpha = new Property<RippleView, number | null | undefined>({
    name: 'rippleColorAlpha',
    affectsLayout: false,
    valueConverter: (v) => v != null && v !== undefined ? +v : undefined,
    valueChanged: (target) => { target._updateAlpha(); }
});
rippleColorAlpha.register(RippleView);

export const rippleLayer = new Property<RippleView, "background" | "foreground" | "auto">({
    name: 'rippleLayer',
    defaultValue: "auto",
    affectsLayout: false,
    valueChanged: (target) => { target._updateLayer(); }
});
rippleLayer.register(RippleView);

export const rippleEnabled = new Property<RippleView, boolean>({
    name: 'rippleEnabled',
    defaultValue: true,
    affectsLayout: false,
    valueConverter: booleanConverter,
    valueChanged: (target) => { target._updateEnabled(); }
});
rippleEnabled.register(RippleView);
