import { View } from "tns-core-modules/ui/page/page";
import { RippleCommon } from "./ripple.common";
export declare class Ripple extends RippleCommon {
    private hasCachedBackground;
    private cachedRippleDrawable;
    private cachedViewBackground;
    private originalNSFn;
    private previousNSFn;
    protected _rippleLayer: "background" | "foreground" | "auto";
    protected _enabled: boolean;
    enabled: boolean;
    rippleLayer: "background" | "foreground" | "auto";
    constructor(tnsView: View);
    init(): void;
    dispose(): void;
    onLoaded(): void;
    protected apply(): boolean;
    remove(): boolean;
    protected refreshRippleColor(): void;
    private getTargetRipple();
    private getTargetLayer();
    private monkeyPatch;
}
