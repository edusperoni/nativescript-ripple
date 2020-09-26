import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { RippleHelper } from 'nativescript-ripple';

@Directive({ selector: '[ripple]' })
export class NativeRippleDirective implements OnInit, OnChanges, OnDestroy {
    @Input() ripple?: string;
    @Input() rippleColor?: string;
    @Input() rippleColorAlpha?: number; // multiplicative with rippleColor and the default ripple opacity of 0.5 (from RippleDrawable)
    @Input() rippleLayer: "background" | "foreground" | "auto" = "auto";
    private rippleHelper: RippleHelper;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.rippleHelper = new RippleHelper(this.el.nativeElement);
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