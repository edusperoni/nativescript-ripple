/***************************************************************************************
* Made for the {N} community by Brad Martin @BradWayneMartin
* https://twitter.com/BradWayneMartin
* https://github.com/bradmartin
* http://bradmartin.net
*************************************************************************************/

import * as common from './ripple-common';
import { View } from "tns-core-modules/ui/core/view";
import { Color } from "tns-core-modules/color";
import { TouchGestureEventData, GestureTypes } from 'tns-core-modules/ui/gestures';

declare var CGAffineTransformMakeScale: any;
declare var CGPointMake: any;
declare var CGRectMake: any;
declare var UIView: any;
declare var UIViewAnimationOptionCurveEaseOut: any;

export class Ripple extends common.Ripple {

    performRipple(x: number, y: number) {
        if (!(this.content instanceof View)) {
            return;
        }

        const nativeView = this.content.ios;

        const scale = 8.0;

        const size = this.content.getActualSize();
        const radius = Math.min(Math.min(size.height, size.width) / scale * 0.8, 60);
        const ripple = UIView.alloc().initWithFrame(CGRectMake(0, 0, radius, radius));
        ripple.layer.cornerRadius = radius * 0.5;
        ripple.backgroundColor = (this.content.backgroundColor || new Color('#000000')).ios;
        ripple.alpha = 1.0;
        nativeView.insertSubviewAtIndex(ripple, 0);
        ripple.center = CGPointMake(x || 0, y || 0);

        UIView.animateWithDurationDelayOptionsAnimationsCompletion(0.6, 0, UIViewAnimationOptionCurveEaseOut, () => {
            ripple.transform = CGAffineTransformMakeScale(scale, scale);
            ripple.alpha = 0.0;
            ripple.backgroundColor = new Color(this.rippleColor.hex || '#cecece').ios;
        }, (finished: boolean) => {
            ripple.removeFromSuperview();
        });
    }

    private tapFn: (args: TouchGestureEventData) => void;

    public onLoaded() {
        super.onLoaded();

        if (this.content instanceof View) {
            this.tapFn = (args: TouchGestureEventData) => {
                this.performRipple(args.getX(), args.getY());
            };
            this.content.on(GestureTypes.touch, this.tapFn);
        }
        else {
            throw new Error("Content must inherit from View!");
        }
    }

    public onUnloaded() {
        super.onUnloaded();

        if (this.content instanceof View) {
            this.content.off(GestureTypes.tap, this.tapFn);
        }
    }
}
