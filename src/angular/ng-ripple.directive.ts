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
    loaded: boolean = false;
    initialized: boolean = false;

    tapFn;
    holding: boolean = false;
    holdAnimation: any;

    private originalNSFn: any;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.initialized = true;
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.ripple.currentValue !== changes.ripple.previousValue ||
            changes.rippleColor.currentValue !== changes.rippleColor.currentValue) {
            this.applyOrRemoveRipple();
        }
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

    @HostListener('loaded')
    onLoaded() {
        this.loaded = true;
        if (!this.initialized) {
            this.ngOnInit();
        }
        this.applyOrRemoveRipple();
        // WARNING: monkey patching {N} functions ahead
        this.originalNSFn = this.el.nativeElement._redrawNativeBackground;
        this.el.nativeElement._redrawNativeBackground = (val) => {
            this.originalNSFn(val);
            this.applyOrRemoveRipple();
        };
    }

    @HostListener('unloaded')
    onUnloaded() {
        this.loaded = false;
        this.removeRipple();
        // remove monkey patch
        this.el.nativeElement._redrawNativeBackground = this.originalNSFn;
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
        ripple.backgroundColor = new Color(
            this.rippleColor || '#400000'
        ).ios;
        ripple.alpha = 0.5;
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
        holdanim.backgroundColor = new Color(
            this.rippleColor || '#400000'
        ).ios;
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
                holdanim.alpha = 0.24;
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
        if (this.el.nativeElement instanceof View) {
            const LOLLIPOP = 21;
            if (android.os.Build.VERSION.SDK_INT >= LOLLIPOP) {
                const androidView = (<View>this.el.nativeElement).android;
                const outerRadii = Array.create('float', 8);
                outerRadii[0] = outerRadii[1] = this.getInDP((<View>this.el.nativeElement).borderTopLeftRadius);
                outerRadii[2] = outerRadii[3] = this.getInDP((<View>this.el.nativeElement).borderTopRightRadius);
                outerRadii[4] = outerRadii[5] = this.getInDP((<View>this.el.nativeElement).borderBottomLeftRadius);
                outerRadii[6] = outerRadii[7] = this.getInDP((<View>this.el.nativeElement).borderBottomRightRadius);
                const r = new android.graphics.drawable.shapes.RoundRectShape(outerRadii, null, null);
                const shapeDrawable = new android.graphics.drawable.ShapeDrawable(r);
                shapeDrawable.getPaint().setColor(android.graphics.Color.BLACK);
                if (androidView.getBackground() == null) { // safe measure. If background is null, turning off and on the screen would make it black
                    androidView.setBackgroundColor(android.graphics.Color.TRANSPARENT);
                }
                const drawable = new (<any>android.graphics.drawable).RippleDrawable(
                    android.content.res.ColorStateList.valueOf(android.graphics.Color.parseColor(this.rippleColor || '#40000000')),
                    androidView.getBackground() instanceof (<any>android.graphics.drawable).RippleDrawable ?
                        (<any>androidView.getBackground()).getDrawable(0) : androidView.getBackground(),
                    shapeDrawable);

                androidView.setBackground(drawable);
            }
        }
    }

    removeOnAndroid() {
        if (this.el.nativeElement instanceof View) {
            const LOLLIPOP = 21;
            if (android.os.Build.VERSION.SDK_INT >= LOLLIPOP) {
                const androidView = (<View>this.el.nativeElement).android;
                if (androidView.getBackground() instanceof (<any>android.graphics.drawable).RippleDrawable) {
                    androidView.setBackground((<any>androidView.getBackground()).getDrawable(0));
                }
            }
        }
    }

}