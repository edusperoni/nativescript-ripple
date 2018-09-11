import { Directive, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Color } from 'tns-core-modules/color';
import * as platform from 'tns-core-modules/platform';
import { View } from 'tns-core-modules/ui/core/view';
import { GestureTypes, TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { Length } from 'tns-core-modules/ui/styling/style-properties';

declare const android: any;
declare const java: any;
declare const Array: any;
declare var CGAffineTransformMakeScale: any;
declare var CGPointMake: any;
declare var CGRectMake: any;
declare var UIView: any;
declare var UIViewAnimationOptionCurveEaseOut: any;

@Directive({ selector: '[ripple]' })
export class NativeRippleDirective implements OnInit, OnChanges {
    @Input() ripple: string;
    @Input() rippleColor?: string;
    @Input() rippleColorAlpha?: number = 0.25; // multiplicative with rippleColor and the default ripple opacity of 0.5 (from RippleDrawable)
    @Input() rippleLayer?: "background" | "foreground" = "foreground";
    loaded: boolean = false;
    initialized: boolean = false;

    tapFn;
    holding: boolean = false;
    holdAnimation: any;

    private originalNSFn: any;
    private previousNSFn: any;

    constructor(private el: ElementRef) {
        if (platform.isAndroid) {
            this.originalNSFn = this.el.nativeElement._redrawNativeBackground; //always store the original method
        }
    }

    ngOnInit() {
        this.initialized = true;
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.ripple.currentValue !== changes.ripple.previousValue ||
            changes.rippleColor.currentValue !== changes.rippleColor.currentValue) {
            this.applyOrRemoveRipple();
        }
    }

    getRippleColor() {
        let c = new Color(this.rippleColor || "#000000");
        c = new Color(c.a * (this.rippleColorAlpha || 0.25), c.r, c.g, c.b);
        return c;
    }

    getRippleAlpha() {
        return (this.rippleColorAlpha || 0.25) * (platform.isIOS ? 0.5 : 1);
    }

    getRippleLayer() {
        return (this.rippleLayer || "foreground");
    }

    applyOrRemoveRipple() {
        if (!this.loaded) {
            return;
        }
        if (this.ripple !== "off") {
            this.applyRipple();
        } else {
            this.removeRipple();
        }
    }

    monkeyPatch = (val) => {
        this.previousNSFn.call(this.el.nativeElement, val);
        this.applyOrRemoveRipple();
    }

    @HostListener('loaded')
    onLoaded() {
        this.loaded = true;
        if (!this.initialized) {
            this.ngOnInit();
        }
        this.applyOrRemoveRipple();
        // WARNING: monkey patching {N} functions ahead
        if (platform.isAndroid) {
            this.previousNSFn = this.el.nativeElement._redrawNativeBackground; // monkey should play nice with other monkeys
            this.el.nativeElement._redrawNativeBackground = this.monkeyPatch;
        }
    }

    @HostListener('unloaded')
    onUnloaded() {
        this.loaded = false;
        this.removeRipple();
        // remove monkey patch
        if (platform.isAndroid) {
            this.el.nativeElement._redrawNativeBackground = this.originalNSFn; // always revert to the original
        }
    }
    getInDP(radius: Length): number {
        return Length.toDevicePixels(radius, 0);
    }

    applyRipple() {
        if (platform.isAndroid) {
            this.applyOnAndroid();
        } else if (platform.isIOS) {
            this.applyOnIOS();
        }
    }

    removeRipple() {
        if (platform.isIOS) {
            this.removeOnIOS();
        } else if (platform.isAndroid) {
            this.removeOnAndroid();
        }
    }

    removeHold() {
        if (this.holdAnimation) {
            this.holdAnimation.removeFromSuperview();
            this.holdAnimation = null;
        }
    }

    performRipple(x: number, y: number) {
        if (!(this.el.nativeElement instanceof View)) {
            return;
        }
        this.removeHold();

        const nativeView = this.el.nativeElement.ios;

        const scale = 8.0;

        const size = this.el.nativeElement.getActualSize();
        x = Math.min(Math.max(x, 0), size.width);
        y = Math.min(Math.max(y, 0), size.height);
        const radius = 30;
        const ripple = UIView.alloc().initWithFrame(
            CGRectMake(0, 0, radius, radius)
        );
        ripple.layer.cornerRadius = radius * 0.5;
        ripple.backgroundColor = this.getRippleColor().ios;
        ripple.alpha = this.getRippleAlpha();
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

    performHold() {
        if (!(this.el.nativeElement instanceof View)) {
            return;
        }

        const nativeView = this.el.nativeElement.ios;

        const scale = 8.0;

        const size = this.el.nativeElement.getActualSize();
        const holdanim = UIView.alloc().initWithFrame(
            CGRectMake(0, 0, size.width, size.height)
        );
        holdanim.backgroundColor = this.getRippleColor().ios;
        holdanim.alpha = 0.0;
        nativeView.insertSubviewAtIndex(holdanim, 0);
        holdanim.center = CGPointMake(size.width / 2.0, size.height / 2.0);

        this.holdAnimation = holdanim;

        UIView.animateWithDurationDelayOptionsAnimationsCompletion(
            0.6,
            0,
            UIViewAnimationOptionCurveEaseOut,
            () => {
                // holdanim.transform = CGAffineTransformMakeScale(scale, scale);
                holdanim.alpha = this.getRippleAlpha();
                // holdanim.backgroundColor = new Color(
                //     this.rippleColor || '#400000'
                // ).ios;
            },
            (finished: boolean) => {
                // holdanim.removeFromSuperview();
            }
        );
    }

    applyOnIOS() {
        if (this.el.nativeElement instanceof View) {
            this.tapFn = (args: TouchGestureEventData) => {
                if (this.holding && args.action === 'move' &&
                    (args.getX() < 0 || args.getX() > this.el.nativeElement.getActualSize().width ||
                        args.getY() < 0 || args.getY() > this.el.nativeElement.getActualSize().height)) {
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
            };
            this.el.nativeElement.ios.clipsToBounds = true;
            this.el.nativeElement.on(GestureTypes.touch, this.tapFn);
        }
    }
    removeOnIOS() {
        if (this.el.nativeElement instanceof View) {
            this.removeHold();
            this.el.nativeElement.off(GestureTypes.touch, this.tapFn);
        }
    }

    applyOnAndroid() {
        if (this.el.nativeElement instanceof View && (<View>this.el.nativeElement).android) {
            const LOLLIPOP = 21;
            if (android.os.Build.VERSION.SDK_INT >= LOLLIPOP) {
                const androidView = (<View>this.el.nativeElement).android;
                if (
                    (this.getRippleLayer() === "background" && androidView.getForeground() instanceof (<any>android.graphics.drawable).RippleDrawable) ||
                    (this.getRippleLayer() === "foreground" && androidView.getBackground() instanceof (<any>android.graphics.drawable).RippleDrawable)) {
                    this.removeOnAndroid(); // remove old ripples
                }
                let originalBg = this.getRippleLayer() === "background" ? androidView.getBackground() : androidView.getForeground();
                let mask;
                if (originalBg instanceof (<any>android.graphics.drawable).RippleDrawable && originalBg.getNumberOfLayers() < 2) {
                    // previous ripple didn't need a mask!
                    mask = null;
                } else {
                    const outerRadii = Array.create('float', 8);
                    outerRadii[0] = outerRadii[1] = this.getInDP((<View>this.el.nativeElement).borderTopLeftRadius);
                    outerRadii[2] = outerRadii[3] = this.getInDP((<View>this.el.nativeElement).borderTopRightRadius);
                    outerRadii[4] = outerRadii[5] = this.getInDP((<View>this.el.nativeElement).borderBottomRightRadius);
                    outerRadii[6] = outerRadii[7] = this.getInDP((<View>this.el.nativeElement).borderBottomLeftRadius);
                    const r = new android.graphics.drawable.shapes.RoundRectShape(outerRadii, null, null);
                    mask = new android.graphics.drawable.ShapeDrawable(r);
                    mask.getPaint().setColor(android.graphics.Color.BLACK);
                }
                let rippleBg = this.getRippleLayer() === "background" ? androidView.getBackground() : androidView.getForeground();
                if (rippleBg == null) { // safe measure. If background is null, turning off and on the screen would make it black
                    rippleBg = new android.graphics.drawable.ColorDrawable(new Color("transparent").android);
                }
                const drawable = new (<any>android.graphics.drawable).RippleDrawable(
                    android.content.res.ColorStateList.valueOf(this.getRippleColor().android),
                    rippleBg instanceof (<any>android.graphics.drawable).RippleDrawable ?
                        rippleBg.getDrawable(0) : rippleBg,
                    mask);

                if (this.getRippleLayer() === "background") {
                    androidView.setBackground(drawable);
                } else {
                    androidView.setForeground(drawable);
                }
            }
        }
    }

    removeOnAndroid() {
        if (this.el.nativeElement instanceof View && (<View>this.el.nativeElement).android) {
            const LOLLIPOP = 21;
            if (android.os.Build.VERSION.SDK_INT >= LOLLIPOP) {
                const androidView = (<View>this.el.nativeElement).android;
                if (androidView.getForeground() instanceof (<any>android.graphics.drawable).RippleDrawable) {
                    androidView.setForeground((<any>androidView.getForeground()).getDrawable(0));
                }
                if (androidView.getBackground() instanceof (<any>android.graphics.drawable).RippleDrawable) {
                    androidView.setBackground((<any>androidView.getBackground()).getDrawable(0));
                }
            }
        }
    }

}