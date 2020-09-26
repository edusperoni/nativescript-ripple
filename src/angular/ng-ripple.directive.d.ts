import { ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
export declare class NativeRippleDirective implements OnInit, OnChanges, OnDestroy {
    private el;
    ripple?: string;
    rippleColor?: string;
    rippleColorAlpha?: number;
    rippleLayer: "background" | "foreground" | "auto";
    private rippleHelper;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
