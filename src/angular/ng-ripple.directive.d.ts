import { ElementRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Length } from 'tns-core-modules/ui/styling/style-properties';
export declare class NativeRippleDirective implements OnInit, OnChanges {
    private el;
    rippleColor?: string;
    loaded: boolean;
    initialized: boolean;
    tapFn: any;
    holding: boolean;
    holdAnimation: any;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    onLoaded(): void;
    onUnloaded(): void;
    getInDP(radius: Length): number;
    applyRipple(): void;
    removeRipple(): void;
    removeHold(): void;
    performRipple(x: number, y: number): void;
    performHold(): void;
    applyOnIOS(): void;
    removeOnIOS(): void;
    applyOnAndroid(): void;
}
