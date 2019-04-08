import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, SimpleChange } from '@angular/core';
import { Color } from 'tns-core-modules/color';
import * as platform from 'tns-core-modules/platform';
import { View } from 'tns-core-modules/ui/core/view';
import { addWeakEventListener, removeWeakEventListener } from "tns-core-modules/ui/core/weak-event-listener";
import { GestureTypes, TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { Length } from 'tns-core-modules/ui/styling/style-properties';
import { Ripple } from '../lib/ripple';

declare const android: any;
declare const java: any;
declare const Array: any;
declare var CGAffineTransformMakeScale: any;
declare var CGPointMake: any;
declare var CGRectMake: any;
declare var UIView: any;
declare var UIViewAnimationOptionCurveEaseOut: any;

const MARSHMALLOW = 23;
const LOLLIPOP = 21;

@Directive({ selector: '[ripple]' })
export class NativeRippleDirective implements OnInit, OnChanges, OnDestroy {
    @Input() ripple?: string;
    @Input() rippleColor?: string;
    @Input() rippleColorAlpha?: number; // multiplicative with rippleColor and the default ripple opacity of 0.5 (from RippleDrawable)
    @Input() rippleLayer: "background" | "foreground" | "auto" = "auto";
    private rippleHelper: Ripple;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.rippleHelper = new Ripple(this.el.nativeElement);
        this.rippleHelper.alpha = this.rippleColorAlpha;
        this.rippleHelper.color = this.rippleColor;
        this.rippleHelper.enabled = this.ripple !== "off";
        this.rippleHelper.rippleLayer = this.rippleLayer;
        this.rippleHelper.init();
    }

    ngOnDestroy() {
        this.rippleHelper.dispose();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.rippleHelper) {
            if (changes.ripple) {
                this.rippleHelper.enabled = this.ripple !== "off";
            }
            if (changes.rippleColor) {
                this.rippleHelper.color = this.rippleColor;
            }
            if (changes.rippleColorAlpha) {
                this.rippleHelper.alpha = this.rippleColorAlpha;
            }
            if (changes.rippleLayer) {
                this.rippleHelper.rippleLayer = this.rippleLayer;
            }
        }
    }
}