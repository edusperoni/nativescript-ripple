import { Color } from 'tns-core-modules/color';
import { ContentView } from 'tns-core-modules/ui/content-view';
import { Property } from 'tns-core-modules/ui/core/properties';
import { View, booleanConverter } from 'tns-core-modules/ui/core/view';
import { Ripple } from './lib/ripple';

export class RippleView extends ContentView {
    private rippleHelper: Ripple;

    constructor() {
        super();
        console.log("CONSTRUCTOR");
    }

    public _addChildFromBuilder(name: string, value: any) {
        super._addChildFromBuilder(name, value);
        console.log(name, value);
        if (this.content) {
            this.rippleHelper = new Ripple(value);
            this.rippleHelper.init();
            console.log(this.content, this.rippleHelper);
        }
    }
}

// export const rippleColorProperty = new Property<RippleView, Color>({
//     name: 'rippleColor',
//     equalityComparer: Color.equals,
//     valueConverter: v => new Color(v)
// });
// rippleColorProperty.register(RippleView);

// export const rippleColorAlpha = new Property<RippleView, number>({
//     name: 'rippleColorAlpha',
//     affectsLayout: false
// });
// rippleColorAlpha.register(RippleView);

// export const rippleLayer = new Property<RippleView, "background" | "foreground" | "auto">({
//     name: 'rippleLayer',
//     defaultValue: "auto",
//     affectsLayout: false
// });
// rippleLayer.register(RippleView);

// export const rippleEnabled = new Property<RippleView, boolean>({
//     name: 'rippleEnabled',
//     defaultValue: false,
//     affectsLayout: false,
//     valueConverter: booleanConverter
// });
// rippleLayer.register(RippleView);
