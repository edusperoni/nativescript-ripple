import { View } from "tns-core-modules/ui/page/page";
import { RippleCommon } from "./ripple.common";
export declare class Ripple extends RippleCommon {
    private static readonly IOS_RIPPLE_ALPHA;
    private tapFn;
    private holding;
    private holdAnimation;
    constructor(tnsView: View);
    dispose(): void;
    private removeHold();
    private performRipple(x, y);
    private performHold();
    apply(): boolean;
    remove(): boolean;
}
