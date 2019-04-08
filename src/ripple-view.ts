import { Color } from 'tns-core-modules/color';
import { ContentView } from 'tns-core-modules/ui/content-view';
import { Property } from 'tns-core-modules/ui/core/properties';
import { View, booleanConverter } from 'tns-core-modules/ui/core/view';
import { Ripple } from './lib/ripple';


export class RippleView extends ContentView {
    public content: any = null;
    private rippleHelper: Ripple;

    public _addChildFromBuilder(name: string, value: any) {
        if (value instanceof View) {
            this.content = value;
            this.rippleHelper = new Ripple(value);
            this.rippleHelper.init();
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
