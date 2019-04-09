import { Color } from "tns-core-modules/color";
import { View } from "tns-core-modules/ui/page/page";
export declare class RippleCommon {
    protected static DEFAULT_RIPPLE_ALPHA: number;
    protected tnsView: WeakRef<View>;
    protected effectiveColor: Color;
    protected _rippleColor: string | Color;
    protected _rippleColorAlpha: number | null | undefined;
    protected _enabled: boolean;
    protected rippleApplied: boolean;
    protected _rippleLayer: "background" | "foreground" | "auto";
    protected initialized: boolean;
    enabled: boolean;
    rippleLayer: "background" | "foreground" | "auto";
    color: string | Color;
    alpha: number | null | undefined;
    constructor(tnsView: View);
    init(): void;
    dispose(): void;
    refreshRippleState(): void;
    protected apply(): boolean;
    protected remove(): boolean;
    protected invalidateColor(): void;
    protected refreshRippleColor(): void;
    protected onLoaded(): void;
    protected onUnloaded(): void;
    private setEffectiveColor();
    private bindEvents();
}
