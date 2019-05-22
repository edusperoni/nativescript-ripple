import { GestureTypes, TouchGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { View } from "tns-core-modules/ui/page/page";
import { Length } from "tns-core-modules/ui/styling/style-properties";
import { RippleHelperCommon } from "./ripple-helper.common";

declare var CGAffineTransformMakeScale: any;
declare var CGPointMake: any;
declare var CGRectMake: any;
declare var UIView: any;
declare var UIViewAnimationOptionCurveEaseOut: any;

export class RippleHelper extends RippleHelperCommon {
    private static readonly IOS_RIPPLE_ALPHA = 0.5;
    private tapFn;
    private holding: boolean = false;
    private holdAnimation: any;

    constructor(tnsView: View) {
        super(tnsView);
    }

    dispose() {
        super.dispose();
        this.remove();
    }

    private removeHold() {
        if (this.holdAnimation) {
            this.holdAnimation.removeFromSuperview();
            this.holdAnimation = null;
        }
    }

    private performRipple(x: number, y: number) {
        const tnsView = this.tnsView.get();
        if (!(tnsView instanceof View)) {
            return;
        }
        this.removeHold();

        const nativeView = tnsView.ios;

        const scale = 8.0;

        const size = tnsView.getActualSize();
        x = Math.min(Math.max(x, 0), size.width);
        y = Math.min(Math.max(y, 0), size.height);
        const radius = 30;
        const ripple = UIView.alloc().initWithFrame(
            CGRectMake(0, 0, radius, radius)
        );
        ripple.layer.cornerRadius = radius * 0.5;
        ripple.backgroundColor = this.effectiveColor.ios;
        ripple.alpha = RippleHelper.IOS_RIPPLE_ALPHA;
        ripple.userInteractionEnabled = false;
        nativeView.insertSubviewAtIndex(ripple, 0);
        ripple.center = CGPointMake(x || 0, y || 0);

        UIView.animateWithDurationDelayOptionsAnimationsCompletion(
            0.4,
            0,
            UIViewAnimationOptionCurveEaseOut,
            () => {
                ripple.transform = CGAffineTransformMakeScale(scale, scale);
                ripple.alpha = 0.0;
            },
            (finished: boolean) => {
                ripple.removeFromSuperview();
            }
        );
    }

    private performHold() {
        const tnsView = this.tnsView.get();
        if (!(tnsView instanceof View)) {
            return;
        }
        if (this.holdAnimation) {
            this.removeHold(); // this should never happen, but...
        }

        const nativeView = tnsView.ios;

        const scale = 8.0;

        const size = tnsView.getActualSize();
        const holdanim = UIView.alloc().initWithFrame(
            CGRectMake(0, 0, size.width, size.height)
        );
        holdanim.backgroundColor = this.effectiveColor.ios;
        holdanim.alpha = 0.0;
        holdanim.userInteractionEnabled = false;
        nativeView.insertSubviewAtIndex(holdanim, 0);
        holdanim.center = CGPointMake(size.width / 2.0, size.height / 2.0);

        this.holdAnimation = holdanim;

        UIView.animateWithDurationDelayOptionsAnimationsCompletion(
            0.6,
            0,
            UIViewAnimationOptionCurveEaseOut,
            () => {
                holdanim.alpha = RippleHelper.IOS_RIPPLE_ALPHA;
            },
            (finished: boolean) => {
                // holdanim.removeFromSuperview();
            }
        );
    }

    apply() {
        if (this.rippleApplied) {
            return true;
        }
        const outTnsView = this.tnsView.get();
        if (outTnsView instanceof View && outTnsView.ios) {
            this.tapFn = (args: TouchGestureEventData) => {
                const tnsView = this.tnsView.get();
                if (tnsView) {
                    if (this.holding && args.action === 'move' &&
                        (args.getX() < 0 || args.getX() > tnsView.getActualSize().width ||
                            args.getY() < 0 || args.getY() > tnsView.getActualSize().height)) {
                        this.holding = false;
                        this.performRipple(args.getX(), args.getY());
                    } else if (args.action === 'down' && !this.holding) {
                        this.holding = true;
                        this.performHold();
                    } else if (this.holding &&
                        (args.action === 'up' || args.action === 'cancel')) {
                        this.holding = false;
                        this.performRipple(args.getX(), args.getY());
                    }
                }
            };
            outTnsView.ios.clipsToBounds = true;
            outTnsView.on(GestureTypes.touch, this.tapFn);
            return true;
        }
        return false;
    }
    remove() {
        if (!this.rippleApplied) {
            return true;
        }
        const tnsView = this.tnsView.get();
        if (tnsView instanceof View && tnsView.ios) {
            this.removeHold();
            tnsView.off(GestureTypes.touch, this.tapFn);
            return true;
        }
        return false;
    }
}
